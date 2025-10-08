import { Request, Response } from 'express';
import { UniversityServices } from './university.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';


const createUniversity = catchAsync(async (req: Request, res: Response) => {
  const universityData = req.body;
  universityData.logo = universityData.images?.length > 0 ? universityData.images[0] : ''
  const result = await UniversityServices.createUniversity(
    req.user!,
    universityData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'University created successfully',
    data: result,
  });
});

const updateUniversity = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const universityData = req.body;
  universityData.images > 0 ? universityData.images[0] : ''
  const result = await UniversityServices.updateUniversity(id, universityData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'University updated successfully',
    data: result,
  });
});

const getSingleUniversity = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UniversityServices.getSingleUniversity(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'University retrieved successfully',
    data: result,
  });
});

const getAllUniversitys = catchAsync(async (req: Request, res: Response) => {


  const result = await UniversityServices.getAllUniversitys();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Universitys retrieved successfully',
    data: result,
  });
});

const deleteUniversity = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UniversityServices.deleteUniversity(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'University deleted successfully',
    data: result,
  });
});

export const UniversityController = {
  createUniversity,
  updateUniversity,
  getSingleUniversity,
  getAllUniversitys,
  deleteUniversity,
};