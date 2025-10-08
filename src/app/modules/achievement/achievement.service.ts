import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import {  IAchievement } from './achievement.interface';
import { Achievement } from './achievement.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { achievementSearchableFields } from './achievement.constants';
import { Types } from 'mongoose';


const createAchievement = async (
  user: JwtPayload,
  payload: IAchievement
): Promise<IAchievement> => {
    payload.club = user.authId;
    const result = await Achievement.create(payload);
    if (!result) {
      
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Achievement, please try again with valid data.'
      );
    }

    return result;
 
};

const getAllAchievements = async (
  user: JwtPayload,
  pagination: IPaginationOptions
) => {

  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);




  const [result, total] = await Promise.all([
    Achievement
      .find({ club: user.authId })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }).populate('club'),
    Achievement.countDocuments({ club: user.authId }),
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

const getSingleAchievement = async (id: string): Promise<IAchievement> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Achievement ID');
  }


  const result = await Achievement.findById(new Types.ObjectId(id)).populate('club');
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested achievement not found, please try again with valid id'
    );
  }

  return result;
};

const updateAchievement = async (
  user: JwtPayload,
  id: string,
  payload: Partial<IAchievement>
): Promise<IAchievement | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Achievement ID');
  }

  const result = await Achievement.findOneAndUpdate(
    { _id: new Types.ObjectId(id), club: user.authId },
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  ).populate('club').populate('event');

  if (!result) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to update this achievement'
    );
  }

  return result;
};

const deleteAchievement = async (user: JwtPayload, id: string): Promise<IAchievement> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Achievement ID');
  }

  const result = await Achievement.findOneAndDelete({ _id: id,club:user.authId }).populate('club');
  if (!result) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this achievement'
    );
  }

  return result;
};

const getAchievementByClub = async (clubId: string) => {
  if (!Types.ObjectId.isValid(clubId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Club ID');
  }

  const result = await Achievement.find({ club: clubId }).populate('club');
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested achievement not found, please try again with valid id'
    );
  }

  return result;
}

const getAllAchievementsByClub = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Club ID');
  }

  const result = await Achievement.find({ club: id }).populate('club').lean();
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested achievement not found, please try again with valid id'
    );
  }

  return result;
}

export const AchievementServices = {
  createAchievement,
  getAllAchievements,
  getSingleAchievement,
  updateAchievement,
  deleteAchievement,
  getAchievementByClub,
};