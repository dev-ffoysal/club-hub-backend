import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IChatFilterables, IChat } from './chat.interface';
import { Chat } from './chat.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { chatSearchableFields } from './chat.constants';
import { Types } from 'mongoose';


const createChat = async (
  user: JwtPayload,
  payload: IChat
): Promise<IChat> => {
  try {
    const result = await Chat.create(payload);
    if (!result) {
      
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Chat, please try again with valid data.'
      );
    }

    return result;
  } catch (error: any) {
    
    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, 'Duplicate entry found');
    }
    throw error;
  }
};

const getAllChats = async (
  user: JwtPayload,
  filterables: IChatFilterables,
  pagination: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterables;
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: chatSearchableFields.map((field) => ({
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
    Chat
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }).populate('participants').populate('club'),
    Chat.countDocuments(whereConditions),
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

const getSingleChat = async (id: string): Promise<IChat> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Chat ID');
  }

  const result = await Chat.findById(id).populate('participants').populate('club');
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested chat not found, please try again with valid id'
    );
  }

  return result;
};

const updateChat = async (
  id: string,
  payload: Partial<IChat>
): Promise<IChat | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Chat ID');
  }

  const result = await Chat.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  ).populate('participants').populate('club');

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested chat not found, please try again with valid id'
    );
  }

  return result;
};

const deleteChat = async (id: string): Promise<IChat> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Chat ID');
  }

  const result = await Chat.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting chat, please try again with valid id.'
    );
  }

  return result;
};

export const ChatServices = {
  createChat,
  getAllChats,
  getSingleChat,
  updateChat,
  deleteChat,
};