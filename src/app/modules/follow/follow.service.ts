
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { FollowStatus } from './follow.interface';
import { Follow } from './follow.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';



const createOrRemoveFollow = async (
  userId: string,
  clubId: string,
): Promise<FollowStatus> => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();


    const existingFollow = await Follow.findOne({ user: userId, club: clubId }).session(session);

    let isFollowing: boolean;
    let followerCountChange: number;

    if (existingFollow) {
      await Follow.findByIdAndDelete(existingFollow._id).session(session);
      followerCountChange = -1;
      isFollowing = false;
    } else {
  
      await Follow.create([{ user: userId, club: clubId }], { session });
      followerCountChange = 1;
      isFollowing = true;
    }

    const updatedClub = await User.findByIdAndUpdate(
      clubId,
      { $inc: { followersCount: followerCountChange } },
      { new: true, session }
    );

    if (!updatedClub) {
      throw new Error('Club not found');
    }

    await session.commitTransaction();

    return {
      clubId,
      isFollowing,
      followerCount: updatedClub.followersCount || 0,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllFollows = async (
  user: JwtPayload,
  pagination: IPaginationOptions
) => {
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const [result, total] = await Promise.all([
    Follow
      .find({user:user.authId})
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }).populate('user'),
    Follow.countDocuments({user:user.authId}),
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





export const FollowServices = {
  createOrRemoveFollow,
  getAllFollows,

};