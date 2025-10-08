import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IApplicationFilterables, IApplication } from './application.interface';
import { Application } from './application.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { applicationSearchableFields } from './application.constants';
import mongoose, { Types } from 'mongoose';
import { User } from '../user/user.model';
import { emailTemplate } from '../../../shared/emailTemplate';
import { emailHelper } from '../../../helpers/emailHelper';
import { sendNotification } from '../../../helpers/notificationHelper';
import { APPLICATION_STATUS, USER_ROLES } from '../../../enum/user';


const createClubRegistrationApplication = async(payload:IApplication) => {
  //check whether an club exist with same email or not
  const isUserExist = await User.findOne({
    email: payload.clubEmail,
  })

  if(isUserExist){
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'An club already exist with this email, please try with different email.',
    )
  }

  //create a new application
  const application = await Application.create(payload)

  //send email to admin
  const adminEmailTemplate = emailTemplate.applicationSubmission(application.toObject() as IApplication, 'admin')
  const clubEmailTemplate = emailTemplate.applicationSubmission(application.toObject() as IApplication, 'club')
  const applicantEmailTemplate = emailTemplate.applicationSubmission(application.toObject() as IApplication, 'applicant')

  emailHelper.sendEmail(adminEmailTemplate)
  emailHelper.sendEmail(clubEmailTemplate)
  emailHelper.sendEmail(applicantEmailTemplate)

  const notificationData = {
    title: `Club ${application.clubName} has submitted an application.`,
    body: `${application.applicantName} has submitted an application for ${application.clubName}. Purpose ${application.clubPurpose} `,
    type: 'request',
    to: "68a2fb712fd74d06e80c895a",
  }

  await sendNotification(notificationData.to, notificationData.title, notificationData.body)


  return application

}

const getAllApplications = async (
  user: JwtPayload,
  filterables: IApplicationFilterables,
  pagination: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterables;
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: applicationSearchableFields.map((field) => ({
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

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const [result, total] = await Promise.all([
    Application
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }),
    Application.countDocuments(whereConditions),
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

const getSingleApplication = async (id: string): Promise<IApplication> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Application ID');
  }

  const result = await Application.findById(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested application not found, please try again with valid id'
    );
  }

  return result;
};

const updateApplication = async (
  id: string,
  payload: Partial<IApplication>
): Promise<APPLICATION_STATUS | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Application ID');
  }

  if(payload.status === APPLICATION_STATUS.REJECTED){
    if(!payload.rejectedReason){
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Reason is required for rejection');
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await Application.findByIdAndUpdate(id, { $set: payload }, {
      new: true,
      runValidators: true,
    }).session(session);

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Requested application not found');
    }
    const clubSlug = result.clubName.replace(" ","-").toLowerCase()
    if (result.status === APPLICATION_STATUS.APPROVED) {
      const createdClub = await User.create([{
        name: result.clubName,
        university: result.university,
        purpose: result.clubPurpose,
        description: result.description,
        phone: result.clubPhone,
        email: result.clubEmail,
        role: USER_ROLES.CLUB,
        password: "12345678",
        createdBy: result.applicantEmail,
        authentication: {
          restrictionLeftAt: null,
        }
      }], { session });

      if (!createdClub.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Error while creating club');
      }

      result.set({ createdClub: createdClub[0]._id });
      await result.save({ session });

      const applicantEmailTemplate = emailTemplate.applicationStatusUpdate(result.toObject() as IApplication, 'applicant', {
        email: result.applicantEmail,
        password: "12345678",
      });

      const clubEmailTemplate = emailTemplate.applicationStatusUpdate(result.toObject() as IApplication, 'club', {
        email: createdClub[0].email,
        password: "12345678",
      });

      emailHelper.sendEmail(applicantEmailTemplate);
      emailHelper.sendEmail(clubEmailTemplate);

      const notificationData = {
        title: `Welcome ${result.clubName} to Club Hub BD.`,
        body: `Please take a tour to club dashboard to get started. Also make sure to update necessary information about club, otherwise your club will not be listed.`,
        type: 'info',
        to: createdClub[0]._id,
      };
      await sendNotification(notificationData.to.toString(), notificationData.title, notificationData.body);

    } else {
      const applicantEmailTemplate = emailTemplate.applicationStatusUpdate(result.toObject() as IApplication, 'applicant');
      const clubEmailTemplate = emailTemplate.applicationStatusUpdate(result.toObject() as IApplication, 'club');

      emailHelper.sendEmail(applicantEmailTemplate);
      emailHelper.sendEmail(clubEmailTemplate);
    }

    await session.commitTransaction();
    return result.toObject().status;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};


const deleteApplication = async (id: string): Promise<IApplication> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Application ID');
  }

  const result = await Application.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting application, please try again with valid id.'
    );
  }

  return result;
};

export const ApplicationServices = {
  createClubRegistrationApplication,
  getAllApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
};