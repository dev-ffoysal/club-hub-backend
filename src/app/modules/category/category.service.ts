import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import {  ICategory } from './category.interface';
import { Category } from './category.model';
import { Types } from 'mongoose';

const createCategory = async (
  payload: ICategory
): Promise<ICategory> => {
  try {
    payload.slug = payload.title.toLowerCase().replace(/\s+/g, '-');
    const result = await Category.create(payload);
    if (!result) {

      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Category, please try again with valid data.'
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

const getAllCategorys = async (

) => {
  const result = await Category.find({isDeleted:false});

  return result || [];

  
};



const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Category ID');
  }

  const result = await Category.findByIdAndUpdate(
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
      'Requested category not found, please try again with valid id'
    );
  }

  return result;
};

const deleteCategory = async (id: string): Promise<ICategory> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Category ID');
  }

  const result = await Category.findOneAndUpdate(
    { _id: new Types.ObjectId(id) },
    { $set: { isDeleted: true } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting category, please try again with valid id.'
    );
  }

  return result;
};

export const CategoryServices = {
  createCategory,
  getAllCategorys,
  updateCategory,
  deleteCategory,
};