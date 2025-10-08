import { Request, Response } from 'express';
import { ApplicationServices } from './application.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { applicationFilterables } from './application.constants';
import { paginationFields } from '../../../interfaces/pagination';
import { CustomAuthServices } from '../auth/custom.auth/custom.auth.service';

const createClubRegistrationApplication = catchAsync(async (req: Request, res: Response) => {
  const { ...applicationData } = req.body
  const result = await ApplicationServices.createClubRegistrationApplication(applicationData)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Club application created successfully',
    data: result,
  })
})


const updateApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const applicationData = req.body;

  const result = await ApplicationServices.updateApplication(id, applicationData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Application status updated successfully',
    data: result,
  });
});

const getSingleApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ApplicationServices.getSingleApplication(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Application retrieved successfully',
    data: result,
  });
});

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, applicationFilterables);
  const pagination = pick(req.query, paginationFields);

  const result = await ApplicationServices.getAllApplications(
    req.user!,
    filterables,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Applications retrieved successfully',
    data: result,
  });
});

const deleteApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ApplicationServices.deleteApplication(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Application deleted successfully',
    data: result,
  });
});

export const ApplicationController = {
  createClubRegistrationApplication,
  updateApplication,
  getSingleApplication,
  getAllApplications,
  deleteApplication,
};