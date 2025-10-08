import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import {  IClubregistration, IClubregistrationFilterables } from './clubregistration.interface';
import { Clubregistration } from './clubregistration.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { CLUB_REGISTRATION_STATUS, clubregistrationSearchableFields } from './clubregistration.constants';
import mongoose, { Types } from 'mongoose';
import { USER_ROLES } from '../../../enum/user';
import { User } from '../user/user.model';
import { IAmarPayPaymentRequest, PAYMENT_METHOD, PAYMENT_STATUS, REGISTRATION_STATUS } from '../eventRegistration';
import { amarPayService } from '../../../services/amarPayService';
import { clubRegistrationEmailService } from '../../../services/clubRegistrationEmailService';


const createClubregistration = async (
  user: JwtPayload,
  payload: IClubregistration,
): Promise<IClubregistration & {paymentUrl?: string}> => {
  
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    const isClubExist = await User.findById(payload.club).session(session);
    if(!isClubExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'The requested club does not exist, please try with valid club id.');
    }
    //check if the registration is enabled by the club and the time falls under the club registration time
    if(!isClubExist.clubRegistrationEnabled) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'The requested club does not allow registration for now, please try again later.');
    }
    if(isClubExist.clubRegistrationStartsAt && isClubExist.clubRegistrationEndsAt) {
      if(Date.now() < isClubExist.clubRegistrationStartsAt.getTime() || Date.now() > isClubExist.clubRegistrationEndsAt.getTime()) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'The requested club does not allow registration for now, please try again later.');
      }
    }

    payload.isPaymentRequired = isClubExist.clubRegistrationFees ===0 ? false : user.role === USER_ROLES.CLUB ? false :true;
    payload.member = user.role === USER_ROLES.CLUB ? payload.member : user.authId;
    payload.club = user.role === USER_ROLES.CLUB ? user.authId : isClubExist._id;
    payload.status = user.role === USER_ROLES.CLUB ? CLUB_REGISTRATION_STATUS.APPROVED : CLUB_REGISTRATION_STATUS.PENDING;
    payload.isCreatedByAdmin = user.role === USER_ROLES.CLUB;

    const isClubregistrationExist = await Clubregistration.findOne({club: payload.club, member: payload.member}).session(session);
    
    if(isClubregistrationExist && isClubregistrationExist.paymentStatus === PAYMENT_STATUS.COMPLETED && isClubregistrationExist.paymentInfo?.transactionId && isClubregistrationExist.status === CLUB_REGISTRATION_STATUS.APPROVED) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'You have already registered for this club, please contact the club admin to get verified.');
    }


    let paymentUrl = '';
    if(payload.isPaymentRequired) {
      payload.paymentStatus = PAYMENT_STATUS.PENDING;
    }
    const registrationData = {
      club: payload.club,
      member: payload.member,
      isPaymentRequired: payload.isPaymentRequired,
      paymentStatus: payload.paymentStatus,
      isApprovedByClub: false,
      status: payload.status, // Use the correct status from payload
      isCreatedByAdmin: payload.isCreatedByAdmin,
    }
    //now create 

    const [result] = await Clubregistration.create([registrationData], { session });

    if(result.isPaymentRequired) {
      // Prepare payment request
    const paymentRequest: IAmarPayPaymentRequest = {
      clubId: payload.club.toString(),
      userId: payload.member.toString(),
      club: payload.club.toString(), // Legacy field for backward compatibility
      member: payload.member.toString(), // Legacy field for backward compatibility
      amount: isClubExist.clubRegistrationFees!,
      currency: 'BDT',
      successUrl: `https://hello.com?registration_id=${result._id}`,
      failUrl: `https://hello.com?registration_id=${result._id}`,
      cancelUrl: `https://hello.com?registration_id=${result._id}`
    };

    //now create the payment
    const paymentResponse = await amarPayService.initiatePayment(paymentRequest);
    await Clubregistration.findByIdAndUpdate(result._id, {
      'paymentInfo.method': PAYMENT_METHOD.AMARPAY,
      'paymentInfo.transactionId': paymentResponse.mer_txnid,
      'paymentInfo.amount': isClubExist.clubRegistrationFees || 0,
      'paymentInfo.currency': 'BDT'
    }, {session});
    paymentUrl = paymentResponse.payment_url;
    }

    await session.commitTransaction();
    await session.endSession();
    return {
      ...result.toObject(),
      paymentUrl
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

};

/**
 * Process payment success callback for club registration
 */
const processPaymentSuccess = async (callbackData: any): Promise<IClubregistration> => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // Find registration by transaction ID
    const registration = await Clubregistration.findOne({
      'paymentInfo.transactionId': callbackData.mer_txnid
    }).populate('club').session(session);

    if (!registration) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Club registration not found');
    }

    // Verify payment with AmarPay
    const paymentVerification = await amarPayService.processSuccessCallback(callbackData);
    
    if (!paymentVerification.isValid) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment verification failed');
    }

    // Update registration status
    const updatedRegistration = await Clubregistration.findByIdAndUpdate(
      registration._id,
      {
        paymentStatus: PAYMENT_STATUS.COMPLETED,
        status: CLUB_REGISTRATION_STATUS.PENDING,
        'paymentInfo.gatewayResponse': paymentVerification.gatewayResponse,
        'paymentInfo.processedAt': new Date().toISOString()
      },
      { new: true, session }
    ).populate('club member');



    // Update club members count
    await User.findByIdAndUpdate(
      registration.club,
      { $inc: { membersCount: 1 } },
      { session }
    );

    await session.commitTransaction();

    //send notification using redis

    // Send confirmation email
    try {
      const club = registration.club as any;
      const member = registration.member as any;
      
      await clubRegistrationEmailService.sendPaymentConfirmation({
        registration: registration,
        club: club,
        userEmail: member.email,
        userName: member.firstName + ' ' + member.lastName
      });
    } catch (emailError) {
      // Log email error but don't fail the payment process
      console.error('Failed to send club registration confirmation email:', emailError);
    }

    return updatedRegistration!;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Process payment failure callback for club registration
 */
const processPaymentFailure = async (callbackData: any): Promise<IClubregistration> => {
  // Find registration by transaction ID
  const registration = await Clubregistration.findOne({
    'paymentInfo.transactionId': callbackData.mer_txnid
  });

  if (!registration) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Club registration not found');
  }

  // Process failure with AmarPay
  const paymentResult = amarPayService.processFailureCallback(callbackData);

  // Update registration status
  const updatedRegistration = await Clubregistration.findByIdAndUpdate(
    registration._id,
    {
      paymentStatus: PAYMENT_STATUS.FAILED,
      status: CLUB_REGISTRATION_STATUS.REJECTED,
      'paymentInfo.gatewayResponse': paymentResult.gatewayResponse
    },
    { new: true }
  ).populate('club member');

  // Send failure email
  try {
    const club = updatedRegistration!.club as any;
    const member = updatedRegistration!.member as any;
    
    await clubRegistrationEmailService.sendPaymentFailure({
      registration: updatedRegistration!,
      club: club,
      userEmail: member.email,
      userName: member.firstName + ' ' + member.lastName,
      reason: paymentResult.reason
    });
  } catch (emailError) {
    // Log email error but don't fail the process
    console.error('Failed to send club registration failure email:', emailError);
  }

  return updatedRegistration!;
};

const getAllClubregistrations = async (
  user: JwtPayload,
  filterables: IClubregistrationFilterables,
  pagination: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterables;
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: clubregistrationSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filter functionality
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }
  andConditions.push({
    club: user.authId,
  })
  console.log(user)
  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const [result, total] = await Promise.all([
    Clubregistration
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }).populate('club').populate('member').lean(),
    Clubregistration.countDocuments(whereConditions),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getSingleClubregistration = async (id: string): Promise<IClubregistration> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Clubregistration ID');
  }

  const result = await Clubregistration.findById(id).populate('club').populate('member').lean();
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested clubregistration not found, please try again with valid id'
    );
  }

  return result;
};

const updateClubregistration = async (
  user: JwtPayload,
  id: string,
  payload: Partial<IClubregistration>
): Promise<IClubregistration | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Clubregistration ID');
  }

  payload.isApprovedByClub = payload.status === CLUB_REGISTRATION_STATUS.APPROVED;

  const result = await Clubregistration.findOneAndUpdate(
    { _id: new Types.ObjectId(id), club:user.authId },
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  ).populate('club').populate('member');

  if (!result) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to update this clubregistration'
    );
  }

  if(payload.isApprovedByClub){
    //send notification to member and email with redis
  }

  return result;
};

const deleteClubregistration = async (id: string): Promise<IClubregistration> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Clubregistration ID');
  }

  const result = await Clubregistration.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting clubregistration, please try again with valid id.'
    );
  }

  return result;
};

export const ClubregistrationServices = {
  createClubregistration,
  getAllClubregistrations,
  getSingleClubregistration,
  updateClubregistration,
  deleteClubregistration,
  processPaymentSuccess,
  processPaymentFailure,
};