import { Request, Response } from 'express';
import { ClubregistrationServices } from './clubregistration.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { clubregistrationFilterables } from './clubregistration.constants';
import { paginationFields } from '../../../interfaces/pagination';

const createClubregistration = catchAsync(async (req: Request, res: Response) => {
  const clubregistrationData = req.body;

  const result = await ClubregistrationServices.createClubregistration(
    req.user!,
    clubregistrationData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Clubregistration created successfully',
    data: result,
  });
});

const updateClubregistration = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const clubregistrationData = req.body;

  const result = await ClubregistrationServices.updateClubregistration(
    req.user!,
    id,
    clubregistrationData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Clubregistration updated successfully',
    data: result,
  });
});

const getSingleClubregistration = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClubregistrationServices.getSingleClubregistration(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Clubregistration retrieved successfully',
    data: result,
  });
});

const getAllClubregistrations = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, clubregistrationFilterables);
  const pagination = pick(req.query, paginationFields);

  const result = await ClubregistrationServices.getAllClubregistrations(
    req.user!,
    filterables,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Clubregistrations retrieved successfully',
    data: result,
  });
});

const deleteClubregistration = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClubregistrationServices.deleteClubregistration(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Clubregistration deleted successfully',
    data: result,
  });
});

/**
 * Payment success callback for club registration
 */
const paymentSuccessCallback = catchAsync(async (req: Request, res: Response) => {
  const callbackData = req.body;

  const result = await ClubregistrationServices.processPaymentSuccess(callbackData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment processed successfully. Club registration confirmed.',
    data: result,
  });
});

/**
 * Payment failure callback for club registration
 */
const paymentFailureCallback = catchAsync(async (req: Request, res: Response) => {
  const callbackData = req.body;

  const result = await ClubregistrationServices.processPaymentFailure(callbackData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment failure processed.',
    data: result,
  });
});

export const ClubregistrationController = {
  createClubregistration,
  updateClubregistration,
  getSingleClubregistration,
  getAllClubregistrations,
  deleteClubregistration,
  paymentSuccessCallback,
  paymentFailureCallback,
};