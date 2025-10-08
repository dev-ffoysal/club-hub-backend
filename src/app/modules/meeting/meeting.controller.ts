import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { meetingService } from './meeting.service';
import { meetingFilterableFields } from './meeting.constants';
import { IMeeting } from './meeting.interface';
import ApiError from '../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const createMeeting = catchAsync(async (req: Request, res: Response) => {
  const meetingData = {
    ...req.body,
    host: (req.user as JwtPayload).authId
  };

  const result = await meetingService.createMeeting(meetingData);

  sendResponse<IMeeting>(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Meeting created successfully',
    data: result
  });
});

const getAllMeetings = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, meetingFilterableFields);
  const paginationOptions = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await meetingService.getAllMeetings(filters, paginationOptions);

  sendResponse<IMeeting[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meetings retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getMeetingById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await meetingService.getMeetingById(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
  }

  sendResponse<IMeeting>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meeting retrieved successfully',
    data: result
  });
});

const getMeetingByCode = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.params;
  const result = await meetingService.getMeetingByCode(code);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
  }

  sendResponse<IMeeting>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meeting retrieved successfully',
    data: result
  });
});

const updateMeeting = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = (req.user as JwtPayload).authId;

  // Check if user is the host
  const meeting = await meetingService.getMeetingById(id);
  if (!meeting) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
  }

  if (meeting.host.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only the host can update the meeting');
  }

  const result = await meetingService.updateMeeting(id, updateData);

  sendResponse<IMeeting>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meeting updated successfully',
    data: result
  });
});

const deleteMeeting = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as JwtPayload).authId;

  // Check if user is the host
  const meeting = await meetingService.getMeetingById(id);
  if (!meeting) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
  }

  if (meeting.host.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only the host can delete the meeting');
  }

  const result = await meetingService.deleteMeeting(id);

  sendResponse<IMeeting>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meeting deleted successfully',
    data: result
  });
});

const startMeeting = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const hostId = (req.user as JwtPayload).authId;

  if (!hostId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await meetingService.startMeeting(id, hostId);

  sendResponse<IMeeting>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meeting started successfully',
    data: result
  });
});

const endMeeting = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const hostId = (req.user as JwtPayload).authId;

  if (!hostId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await meetingService.endMeeting(id, hostId);

  sendResponse<IMeeting>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meeting ended successfully',
    data: result
  });
});

const joinMeeting = catchAsync(async (req: Request, res: Response) => {
  const { meetingCode, guestName } = req.body;
  const userId = (req.user as JwtPayload).authId;
  
  // Generate temporary IDs for demo (in real implementation, these would come from WebRTC)
  const socketId = `socket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const peerId = `peer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const participantData = {
    userId,
    guestName,
    socketId,
    peerId
  };

  const result = await meetingService.joinMeeting(meetingCode, participantData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Joined meeting successfully',
    data: result
  });
});

const leaveMeeting = catchAsync(async (req: Request, res: Response) => {
  const { meetingId, participantId } = req.params;

  const result = await meetingService.leaveMeeting(meetingId, participantId);

  sendResponse<IMeeting>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Left meeting successfully',
    data: result
  });
});

const getMeetingStats = catchAsync(async (req: Request, res: Response) => {
  const hostId = (req.user as JwtPayload).authId;

  if (!hostId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await meetingService.getMeetingStats(hostId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Meeting statistics retrieved successfully',
    data: result
  });
});

const getMyMeetings = catchAsync(async (req: Request, res: Response) => {
  const hostId = (req.user as JwtPayload).authId;
  const filters = { ...pick(req.query, meetingFilterableFields), host: hostId };
  const paginationOptions = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await meetingService.getAllMeetings(filters, paginationOptions);

  sendResponse<IMeeting[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My meetings retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

export const MeetingController = {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  getMeetingByCode,
  updateMeeting,
  deleteMeeting,
  startMeeting,
  endMeeting,
  joinMeeting,
  leaveMeeting,
  getMeetingStats,
  getMyMeetings
};