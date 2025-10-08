import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICommitte } from './committe.interface';
import { Committe } from './committe.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { mongo, Types } from 'mongoose';
import { User } from '../user/user.model';
import { Chat } from '../chat/chat.model';
import { IUser } from '../user/user.interface';


const createCommitte = async (
  user: JwtPayload,
  payload: ICommitte
): Promise<string> => {
 
  payload.club = user.authId;
  const session = await mongoose.startSession();
  session.startTransaction();
  const activeCommitteExists = await Committe.findOne({club:user.authId,status:'active'}).populate({
    path:'club',
    select:{
      name:1,
      profile:1,
      clubName:1,
      email:1
    }
  }).lean();
  if(activeCommitteExists){
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You already have an active committe, please deactivate it first.'
    );
  }
  try {
    const result = await Committe.create(payload, { session });
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Committe, please try again with valid data.'
      );
    }
    const updatedClub = await User.findByIdAndUpdate(payload.club, {
      $set: {
        clubCommittee: result[0]._id,
      }
    }, { session }).populate<{club:IUser}>('club');

    const getCommiteeYear = payload.from.getFullYear();
    //now also create chat for the new commitee
    await Chat.create({
      participants: result[0].members.map((member) => member.member),
      club: user.authId,
      isCommitteeChat: true,
      groupName:  `${updatedClub?.club.clubName}-${getCommiteeYear}` as string,
      committee:result[0]._id
    }, { session })



    await session.commitTransaction();
    await session.endSession();
    return "Commitee created successfully.";
  } catch (error: any) {
    await session.abortTransaction();
   await session.endSession();
    throw error;
  }
};

const getAllCommittes = async (
  user:JwtPayload,
  filters:{
    year?:string,
    status?:string | 'active' | 'inactive'
  }
) => {
  const query = {club:user.authId} as any;
  if(filters.year){
    query.year = filters.year
  }
  if(filters.status){
    query.status = filters.status
  }

  const result = await Committe.find(query).populate('club').populate('members.member');
  return result || []
};

const getSingleCommitte = async (id: string): Promise<ICommitte> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Committe ID');
  }

  const result = await Committe.findById(id).populate('club').populate('members.member').lean();
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested committe not found, please try again with valid id'
    );
  }

  return result;
};

const updateCommitte = async (
  id: string,
  payload: Partial<ICommitte>
): Promise<string> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Committe ID');
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide some data to update.');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isCommitteExist = await Committe.findById(id).session(session);

    if (!isCommitteExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Committe not found, please try again with valid id.');
    }

    if (isCommitteExist.status === 'inactive') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Only active committe can be updated.');
    }

    // Detect new & excluded members if members are being updated
    let newMembers: Types.ObjectId[] = [];
    let excludedMembers: Types.ObjectId[] = [];

    if (payload.members) {
      const existingIds = isCommitteExist.members.map(m => m.member.toString());
      const incomingIds = payload.members.map(m => m.member.toString());

      newMembers = incomingIds.filter(id => !existingIds.includes(id)).map(id => new Types.ObjectId(id));
      excludedMembers = existingIds.filter(id => !incomingIds.includes(id)).map(id => new Types.ObjectId(id));
    }

    // Perform update
    const result = await Committe.findByIdAndUpdate(
      id,
      { $set: payload },
      { session, new: true }
    );

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Requested committe not found, please try again with valid id');
    }

    // Example: you can handle new/excluded members here (logging, notifications, etc.)
    // console.log("New Members:", newMembers);
    // console.log("Excluded Members:", excludedMembers);

    await session.commitTransaction();
    return 'Committe updated successfully.';
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};


const deactivateCommitte = async (id: string): Promise<ICommitte> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Committe ID');
  }
  //check if committe exist
  const isCommitteExist = await Committe.findById(id);
  if (!isCommitteExist) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested committe not found, please try again with valid id'
    );
  }

  //toggle status based on current status 
  const result = await Committe.findByIdAndUpdate(id,{status:isCommitteExist.status === 'active' ? 'inactive' : 'active'});
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while updating committe status, please try again with valid id.'
    );
  }

  return result;
};

export const CommitteServices = {
  createCommitte,
  getAllCommittes,
  getSingleCommitte,
  updateCommitte,
  deactivateCommitte,
};