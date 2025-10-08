import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ITagFilterables, ITag } from './tag.interface';
import { Tag } from './tag.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { tagSearchableFields } from './tag.constants';
import { Types } from 'mongoose';


const createTag = async (
  user: JwtPayload,
  payload: ITag
): Promise<ITag> => {
  try {
    const result = await Tag.create(payload);
    if (!result) {
      
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Tag, please try again with valid data.'
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

const getAllTags = async (
) => {

  const result= await Tag.find({})

 return result || []
};



const updateTag = async (
  id: string,
  payload: Partial<ITag>
): Promise<ITag | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Tag ID');
  }

  const result = await Tag.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested tag not found, please try again with valid id'
    );
  }

  return result;
};

const deleteTag = async (id: string): Promise<ITag> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Tag ID');
  }

  const result = await Tag.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting tag, please try again with valid id.'
    );
  }

  return result;
};

export const TagServices = {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
};