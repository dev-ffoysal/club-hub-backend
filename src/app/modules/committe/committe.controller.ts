import { Request, Response } from 'express';
import { CommitteServices } from './committe.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { committeFilterables } from './committe.constants';
import { paginationFields } from '../../../interfaces/pagination';

const createCommitte = catchAsync(async (req: Request, res: Response) => {
  const committeData = req.body;

  const result = await CommitteServices.createCommitte(
    req.user!,
    committeData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Committe created successfully',
    data: result,
  });
});

const updateCommitte = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const committeData = req.body;

  const result = await CommitteServices.updateCommitte(id, committeData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Committe updated successfully',
    data: result,
  });
});

const getSingleCommitte = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CommitteServices.getSingleCommitte(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Committe retrieved successfully',
    data: result,
  });
});

const getAllCommittes = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;

  const result = await CommitteServices.getAllCommittes(
    req.user!,
    filters 
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Committes retrieved successfully',
    data: result,
  });
});

const deactivateCommitte = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CommitteServices.deactivateCommitte(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Committe deleted successfully',
    data: result,
  });
});

export const CommitteController = {
  createCommitte,
  updateCommitte,
  getSingleCommitte,
  getAllCommittes,
  deactivateCommitte,
};