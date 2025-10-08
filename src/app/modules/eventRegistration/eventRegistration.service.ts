import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';

import { IPaginationOptions } from '../../../interfaces/pagination';
import { Event } from '../event/event.model';
import { User } from '../user/user.model';
import { amarPayService } from '../../../services/amarPayService';
import { eventRegistrationEmailService } from '../../../services/eventRegistrationEmailService';
import {
  IEventRegistration,
  IEventRegistrationFilterables,
  IAmarPayPaymentRequest,
  REGISTRATION_STATUS,
  PAYMENT_STATUS,
  USER_TYPE,
  PAYMENT_METHOD
} from './eventRegistration.interface';
import { EventRegistration } from './eventRegistration.model';
import {
  REGISTRATION_LIMITS,
  eventRegistrationSearchableFields,
  getUserDisplayName,
  getUserEmail
} from './eventRegistration.constants';
import { IGenericResponse } from '../../../interfaces/response';
import { paginationHelper } from '../../../helpers/paginationHelper';


/**
 * Create registration for registered user
 */
const createRegisteredUserRegistration = async (
  userId: string,
  eventId: string,
  paymentUrls: { successUrl: string; failUrl: string; cancelUrl: string }
): Promise<{ registration: IEventRegistration; paymentUrl: string }> => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // Check if event exists and is available for registration
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found');
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Registration deadline has passed');
    }

    // Check if event is full
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Event is full');
    }

    // Check if user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Check if user already registered for this event
    const existingRegistration = await EventRegistration.findOne({
      event: eventId,
      user: userId,
      registrationStatus: { $ne: REGISTRATION_STATUS.CANCELLED }
    }).session(session);

    if (existingRegistration) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User already registered for this event');
    }

    // Check user registration limit
    const userRegistrationCount = await EventRegistration.countDocuments({
      user: userId,
      registrationStatus: REGISTRATION_STATUS.CONFIRMED
    }).session(session);

    if (userRegistrationCount >= REGISTRATION_LIMITS.MAX_REGISTRATIONS_PER_USER) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Maximum ${REGISTRATION_LIMITS.MAX_REGISTRATIONS_PER_USER} active registrations allowed per user`
      );
    }

    // Create registration
    const registrationData = {
      event: eventId,
      user: userId,
      userType: USER_TYPE.REGISTERED,
      registrationStatus: REGISTRATION_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      registeredAt: new Date()
    };

    const registration = await EventRegistration.create([registrationData], { session });

    // Prepare payment request
    const paymentRequest: IAmarPayPaymentRequest = {
      eventId,
      userId,
      amount: event.registrationFee || 0,
      currency: 'BDT',
      successUrl: `${paymentUrls.successUrl}?registration_id=${registration[0]._id}`,
      failUrl: `${paymentUrls.failUrl}?registration_id=${registration[0]._id}`,
      cancelUrl: `${paymentUrls.cancelUrl}?registration_id=${registration[0]._id}`
    };

    // Initiate payment with AmarPay
    const paymentResponse = await amarPayService.initiatePayment(paymentRequest);

    // Update registration with payment transaction ID
    await EventRegistration.findByIdAndUpdate(
      registration[0]._id,
      {
        'paymentInfo.method': PAYMENT_METHOD.AMARPAY,
        'paymentInfo.transactionId': paymentResponse.mer_txnid,
        'paymentInfo.amount': event.registrationFee || 0,
        'paymentInfo.currency': 'BDT'
      },
      { session }
    );

    await session.commitTransaction();

    return {
      registration: registration[0],
      paymentUrl: paymentResponse.payment_url
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Create registration for public user
 */
const createPublicUserRegistration = async (
  eventId: string,
  publicUserInfo: {
    name: string;
    email: string;
    phone: string;
    studentId?: string;
  },
  paymentUrls: { successUrl: string; failUrl: string; cancelUrl: string }
): Promise<{ registration: IEventRegistration; paymentUrl: string }> => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // Check if event exists and is available for registration
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found');
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Registration deadline has passed');
    }

    // Check if event is full
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Event is full');
    }

    // Check if public user already registered for this event
    const existingRegistration = await EventRegistration.findOne({
      event: eventId,
      'publicUserInfo.email': publicUserInfo.email,
      registrationStatus: { $ne: REGISTRATION_STATUS.CANCELLED }
    }).session(session);

    if (existingRegistration) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already registered for this event');
    }

    // Create registration
    const registrationData = {
      event: eventId,
      userType: USER_TYPE.PUBLIC,
      publicUserInfo,
      registrationStatus: REGISTRATION_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      registeredAt: new Date()
    };

    const registration = await EventRegistration.create([registrationData], { session });

    // Prepare payment request
    const paymentRequest: IAmarPayPaymentRequest = {
      eventId,
      publicUserInfo,
      amount: event.registrationFee || 0,
      currency: 'BDT',
      successUrl: `${paymentUrls.successUrl}?registration_id=${registration[0]._id}`,
      failUrl: `${paymentUrls.failUrl}?registration_id=${registration[0]._id}`,
      cancelUrl: `${paymentUrls.cancelUrl}?registration_id=${registration[0]._id}`
    };

    // Initiate payment with AmarPay
    const paymentResponse = await amarPayService.initiatePayment(paymentRequest);

    // Update registration with payment transaction ID
    await EventRegistration.findByIdAndUpdate(
      registration[0]._id,
      {
        'paymentInfo.method': PAYMENT_METHOD.AMARPAY,
        'paymentInfo.transactionId': paymentResponse.mer_txnid,
        'paymentInfo.amount': event.registrationFee || 0,
        'paymentInfo.currency': 'BDT'
      },
      { session }
    );

    await session.commitTransaction();

    return {
      registration: registration[0],
      paymentUrl: paymentResponse.payment_url
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Process payment success callback
 */
const processPaymentSuccess = async (callbackData: any): Promise<IEventRegistration> => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // Find registration by transaction ID
    const registration = await EventRegistration.findOne({
      'paymentInfo.transactionId': callbackData.mer_txnid
    }).populate('event').session(session);

    if (!registration) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Registration not found');
    }

    // Verify payment with AmarPay
    const paymentVerification = await amarPayService.processSuccessCallback(callbackData);
    
    if (!paymentVerification.isValid) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment verification failed');
    }

    // Update registration status
    const updatedRegistration = await EventRegistration.findByIdAndUpdate(
      registration._id,
      {
        paymentStatus: PAYMENT_STATUS.COMPLETED,
        registrationStatus: REGISTRATION_STATUS.CONFIRMED,
        confirmedAt: new Date(),
        'paymentInfo.gatewayResponse': paymentVerification.gatewayResponse,
        'paymentInfo.processedAt': new Date().toISOString()
      },
      { new: true, session }
    ).populate('event user');

    // Update event participant count
    await Event.findByIdAndUpdate(
      registration.event,
      { $inc: { currentParticipants: 1 } },
      { session }
    );

    await session.commitTransaction();

    // Send detailed payment confirmation email
    if (updatedRegistration) {
      const userEmail = getUserEmail(updatedRegistration);
      const userName = getUserDisplayName(updatedRegistration);
      
      try {
        await eventRegistrationEmailService.sendPaymentConfirmation({
          registration: updatedRegistration,
          event: updatedRegistration.event as any,
          userEmail,
          userName
        });

        // Mark email as sent
        await EventRegistration.findByIdAndUpdate(
          updatedRegistration._id,
          { emailSent: true }
        );
      } catch (emailError) {
        // Log email error but don't fail the payment process
        console.error('Failed to send event registration payment confirmation email:', emailError);
      }
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
 * Process payment failure callback
 */
const processPaymentFailure = async (callbackData: any): Promise<IEventRegistration> => {
  // Find registration by transaction ID
  const registration = await EventRegistration.findOne({
    'paymentInfo.transactionId': callbackData.mer_txnid
  });

  if (!registration) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Registration not found');
  }

  // Process failure with AmarPay
  const paymentResult = amarPayService.processFailureCallback(callbackData);

  // Update registration status
  const updatedRegistration = await EventRegistration.findByIdAndUpdate(
    registration._id,
    {
      paymentStatus: PAYMENT_STATUS.FAILED,
      registrationStatus: REGISTRATION_STATUS.CANCELLED,
      cancelledAt: new Date(),
      'paymentInfo.gatewayResponse': paymentResult.gatewayResponse,
      notes: `Payment failed: ${paymentResult.reason}`
    },
    { new: true }
  ).populate('event user');

  // Send detailed payment failure email
  if (updatedRegistration) {
    const userEmail = getUserEmail(updatedRegistration);
    const userName = getUserDisplayName(updatedRegistration);
    
    try {
      await eventRegistrationEmailService.sendRegistrationCancellation({
        registration: updatedRegistration,
        event: updatedRegistration.event as any,
        userEmail,
        userName,
        reason: `Payment failed: ${paymentResult.reason}`
      });
    } catch (emailError) {
      // Log email error but don't fail the process
      console.error('Failed to send event registration payment failure email:', emailError);
    }
  }

  return updatedRegistration!;
};

/**
 * Verify registration by code
 */
const verifyRegistrationByCode = async (registrationCode: string): Promise<{
  isValid: boolean;
  registration?: IEventRegistration;
  event?: any;
  message: string;
}> => {
  const registration = await EventRegistration.find({registrationCode})
    .populate('event user');

  if (!registration) {
    return {
      isValid: false,
      message: 'Invalid registration code'
    };
  }

  if (registration[0].registrationStatus !== REGISTRATION_STATUS.CONFIRMED) {
    return {
      isValid: false,
      registration: registration[0],
      message: `Registration is ${registration[0].registrationStatus.toLowerCase()}`
    };
  }

  if (registration[0].paymentStatus !== PAYMENT_STATUS.COMPLETED) {
    return {
      isValid: false,
      registration: registration[0],
      message: `Payment is ${registration[0].paymentStatus.toLowerCase()}`
    };
  }

  return {
    isValid: true,
    registration: registration[0],
    event: registration[0].event,
    message: 'Registration is valid and confirmed'
  };
};

/**
 * Get all registrations with filtering and pagination
 */
const getAllRegistrations = async (
  filters: IEventRegistrationFilterables,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IEventRegistration[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search term
  if (searchTerm) {
    andConditions.push({
      $or: eventRegistrationSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i'
        }
      }))
    });
  }

  // Filters
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value
      }))
    });
  }

  // Date range filters
  if (filters.startDate || filters.endDate) {
    const dateFilter: any = {};
    if (filters.startDate) {
      dateFilter.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      dateFilter.$lte = new Date(filters.endDate);
    }
    andConditions.push({ createdAt: dateFilter });
  }

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const result = await EventRegistration.find(whereConditions)
    .populate('event user')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await EventRegistration.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: result
  };
};

/**
 * Get single registration
 */
const getSingleRegistration = async (id: string): Promise<IEventRegistration | null> => {
  const result = await EventRegistration.findById(id).populate('event user');
  return result;
};

/**
 * Update registration
 */
const updateRegistration = async (
  id: string,
  payload: Partial<IEventRegistration>
): Promise<IEventRegistration | null> => {
  const result = await EventRegistration.findByIdAndUpdate(id, payload, {
    new: true
  }).populate('event user');
  return result;
};

/**
 * Cancel registration
 */
const cancelRegistration = async (
  id: string,
  reason?: string
): Promise<IEventRegistration | null> => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const registration = await EventRegistration.findById(id).populate('event').session(session);
    if (!registration) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Registration not found');
    }

    if (registration.registrationStatus === REGISTRATION_STATUS.CANCELLED) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Registration is already cancelled');
    }

    // Update registration
    const updatedRegistration = await EventRegistration.findByIdAndUpdate(
      id,
      {
        registrationStatus: REGISTRATION_STATUS.CANCELLED,
        cancelledAt: new Date(),
        notes: reason || 'Registration cancelled by user'
      },
      { new: true, session }
    ).populate('event user');

    // Decrease event participant count if it was confirmed
    if (registration.registrationStatus === REGISTRATION_STATUS.CONFIRMED) {
      await Event.findByIdAndUpdate(
        registration.event,
        { $inc: { currentParticipants: -1 } },
        { session }
      );
    }

    await session.commitTransaction();

    // Send cancellation email
    if (updatedRegistration) {
      const userEmail = getUserEmail(updatedRegistration);
      const userName = getUserDisplayName(updatedRegistration);
      
      await eventRegistrationEmailService.sendRegistrationCancellation({
        registration: updatedRegistration,
        event: updatedRegistration.event as any,
        userEmail,
        userName,
        reason
      });
    }

    return updatedRegistration;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Resend confirmation email
 */
const resendConfirmationEmail = async (id: string): Promise<void> => {
  const registration = await EventRegistration.findById(id).populate('event user');
  
  if (!registration) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Registration not found');
  }

  if (registration.registrationStatus !== REGISTRATION_STATUS.CONFIRMED) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Registration is not confirmed');
  }

  const userEmail = getUserEmail(registration);
  const userName = getUserDisplayName(registration);
  
  await eventRegistrationEmailService.sendRegistrationConfirmation({
    registration,
    event: registration.event as any,
    userEmail,
    userName
  });

  // Mark email as sent
  await EventRegistration.findByIdAndUpdate(id, { emailSent: true });
};

export const EventRegistrationService = {
  createRegisteredUserRegistration,
  createPublicUserRegistration,
  processPaymentSuccess,
  processPaymentFailure,
  verifyRegistrationByCode,
  getAllRegistrations,
  getSingleRegistration,
  updateRegistration,
  cancelRegistration,
  resendConfirmationEmail
};