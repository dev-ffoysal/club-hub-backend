import { Request, Response } from 'express';
import { AdvertisementServices } from './advertisement.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { advertisementFilterables } from './advertisement.constants';
import { paginationFields } from '../../../interfaces/pagination';

const createAdvertisement = catchAsync(async (req: Request, res: Response) => {
  const advertisementData = req.body;

  const result = await AdvertisementServices.createAdvertisement(
    req.user!,
    advertisementData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Advertisement created successfully',
    data: result,
  });
});

const updateAdvertisement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const advertisementData = req.body;

  const result = await AdvertisementServices.updateAdvertisement(
    req.user!,
    id,
    advertisementData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Advertisement updated successfully',
    data: result,
  });
});

const getSingleAdvertisement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdvertisementServices.getSingleAdvertisement(req.user!, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Advertisement retrieved successfully',
    data: result,
  });
});

const getAllAdvertisements = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, advertisementFilterables);
  const pagination = pick(req.query, paginationFields);

  const result = await AdvertisementServices.getAllAdvertisements(
    req.user!,
    filterables,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Advertisements retrieved successfully',
    data: result,
  });
});

const deleteAdvertisement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdvertisementServices.deleteAdvertisement(req.user!, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Advertisement deleted successfully',
    data: result,
  });
});

// Public endpoints for displaying advertisements
const getActiveAdvertisements = catchAsync(async (req: Request, res: Response) => {
  const { limit } = req.query;
  const result = await AdvertisementServices.getActiveAdvertisements(
    undefined,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Active advertisements retrieved successfully',
    data: result,
  });
});

const getAdvertisementsByPosition = catchAsync(async (req: Request, res: Response) => {
  const { position } = req.params;
  const { limit } = req.query;
  
  const result = await AdvertisementServices.getAdvertisementsByPosition(
    position,
    limit ? parseInt(limit as string) : 5
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Advertisements for ${position} position retrieved successfully`,
    data: result,
  });
});

// Tracking endpoints
const trackImpression = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await AdvertisementServices.trackImpression(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Impression tracked successfully',
    data: null,
  });
});

const trackClick = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await AdvertisementServices.trackClick(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Click tracked successfully',
    data: null,
  });
});

// Analytics endpoint
const getAdvertisementStats = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdvertisementServices.getAdvertisementStats(req.user!, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Advertisement statistics retrieved successfully',
    data: result,
  });
});

// Bulk operations
const getAdvertisementsByClub = catchAsync(async (req: Request, res: Response) => {
  const { clubId } = req.params;
  const { limit } = req.query;
  
  const result = await AdvertisementServices.getActiveAdvertisements(
    undefined,
    limit ? parseInt(limit as string) : 10
  );
  
  // Filter by club
  const clubAds = result.filter(ad => ad.club && ad.club._id.toString() === clubId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Club advertisements retrieved successfully',
    data: clubAds,
  });
});

export const AdvertisementController = {
  createAdvertisement,
  updateAdvertisement,
  getSingleAdvertisement,
  getAllAdvertisements,
  deleteAdvertisement,
  getActiveAdvertisements,
  getAdvertisementsByPosition,
  trackImpression,
  trackClick,
  getAdvertisementStats,
  getAdvertisementsByClub
};