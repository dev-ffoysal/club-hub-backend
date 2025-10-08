import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IUniversityFilterables, IUniversity } from './university.interface';
import { University } from './university.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { universitySearchableFields } from './university.constants';
import { Types } from 'mongoose';


const createUniversity = async (
  user: JwtPayload,
  payload: IUniversity
): Promise<IUniversity> => {

    const result = await University.create(payload);
    if (!result) {
      
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create University, please try again with valid data.'
      );
    }

    return result;
 
};

const getAllUniversitys = async (

) => {
  const result = await University.find({isDeleted:false});
  return result || [];
};

const getSingleUniversity = async (id: string): Promise<IUniversity> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid University ID');
  }

  const result = await University.findById(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested university not found, please try again with valid id'
    );
  }

  return result;
};

const updateUniversity = async (
  id: string,
  payload: Partial<IUniversity>
): Promise<string | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid University ID');
  }

  const result = await University.findByIdAndUpdate(
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
      'Requested university not found, please try again with valid id'
    );
  }

  return `${result.name} has been updated successfully.`;
};

const deleteUniversity = async (id: string): Promise<IUniversity> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid University ID');
  }

  const result = await University.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting university, please try again with valid id.'
    );
  }

  return result;
};

export const UniversityServices = {
  createUniversity,
  getAllUniversitys,
  getSingleUniversity,
  updateUniversity,
  deleteUniversity,
};