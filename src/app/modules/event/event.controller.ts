import { Request, Response } from 'express';
import { EventServices } from './event.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { eventFilterables } from './event.constants';
import { paginationFields } from '../../../interfaces/pagination';
import { JwtPayload } from 'jsonwebtoken';

const createEvent = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const {images,covers,...eventData} = req.body;
  if(images?.length > 0){
    eventData.images = images;
  }
  if(covers?.length > 0){
    eventData.cover = covers[0];
  }

  const result = await EventServices.createEvent(
    req.user!,
    eventData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Event created successfully',
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const eventData = req.body;

  const result = await EventServices.updateEvent(
    req.user!,
    id,
    eventData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event updated successfully',
    data: result,
  });
});

const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as JwtPayload).authId;
  
  const result = await EventServices.getSingleEvent(id,userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event retrieved successfully',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, eventFilterables);
  const pagination = pick(req.query, paginationFields);
  const userId = (req.user as JwtPayload).authId;

  const result = await EventServices.getAllEvents(
    filterables,
    pagination,
    userId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Events retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EventServices.deleteEvent(
    req.user!,
    id
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event deleted successfully',
    data: result,
  });
});




const getEventStepInfo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EventServices.getEventWithStepInfo(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event step information retrieved successfully',
    data: result,
  });
});


const getClubsEvents = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, eventFilterables);
  const pagination = pick(req.query, paginationFields);
  const userId = (req.user as JwtPayload).authId;

  const result = await EventServices.getClubsEvents(
    filterables,
    pagination,
    userId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Club Events retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const EventController = {
  createEvent,
  updateEvent,
  getSingleEvent,
  getAllEvents,
  deleteEvent,
  getEventStepInfo,
  getClubsEvents,
};