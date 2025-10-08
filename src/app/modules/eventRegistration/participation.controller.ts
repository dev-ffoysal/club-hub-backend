import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import ParticipationService from './participation.service';
import { PARTICIPATION_STATUS } from './eventRegistration.interface';
import { StatusCodes } from 'http-status-codes';

const markSingleParticipation = catchAsync(async (req: Request, res: Response) => {
  const { registrationId } = req.params;
  const { participated } = req.body;

  const result = await ParticipationService.markSingleParticipation(registrationId, participated);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Participation marked as ${participated ? 'participated' : 'not participated'}`,
    data: result
  });
});

const markBulkParticipation = catchAsync(async (req: Request, res: Response) => {
  const { registrationIds, participated } = req.body;

  const result = await ParticipationService.markBulkParticipation(registrationIds, participated);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Bulk participation updated for ${result.modified} registrations`,
    data: result
  });
});

const getParticipationStats = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const result = await ParticipationService.getParticipationStats(eventId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Participation statistics retrieved successfully',
    data: result
  });
});

const getEventParticipants = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const { participationStatus } = req.query;

  const result = await ParticipationService.getEventParticipants(
    eventId, 
    participationStatus as PARTICIPATION_STATUS
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event participants retrieved successfully',
    data: result
  });
});

export const ParticipationController = {
  markSingleParticipation,
  markBulkParticipation,
  getParticipationStats,
  getEventParticipants
};