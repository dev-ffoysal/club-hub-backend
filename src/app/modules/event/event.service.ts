import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IEventFilterables, IEvent } from './event.interface';
import { Event } from './event.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { eventSearchableFields } from './event.constants';
import { Types } from 'mongoose';
import { Engagement } from '../engagement/engagement.model';


const createEvent = async (
  user: JwtPayload,
  payload: Partial<IEvent>
): Promise<IEvent> => {
  try {
    // Set the createdBy field from the authenticated user
    const eventData = {
      ...payload,
      createdBy: user.authId,
    };

    const result = await Event.create(eventData);
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Event, please try again with valid data.'
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

const getAllEvents = async (
  filterables: IEventFilterables,
  pagination: IPaginationOptions,
  userId: string
) => {
  const { searchTerm, ...filterData } = filterables;
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  // Only show active events by default
  // andConditions.push({ isActive: true });

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: eventSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filter functionality
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const [result, total] = await Promise.all([
    Event
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }).populate('createdBy').populate('organizedBy').lean(),
    Event.countDocuments(whereConditions),
    
  ]);

  const votedEvents = await Engagement.find({ user: new Types.ObjectId(userId), event: { $in: result.map((event) => event._id) } }).lean();

  //now append isVoted with vote type in the result
  result.forEach((event) => {
    const isVoted = votedEvents.find((vote) => vote.event.toString() === event._id.toString());
    event.isVoted = isVoted?.voteType ? true : false;
    event.voteType = isVoted?.voteType || null;
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getSingleEvent = async (id: string, userId: string): Promise<IEvent> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Event ID');
  }

  const result = await Event.findById(id).populate('createdBy').populate('organizedBy').lean();
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested event not found, please try again with valid id'
    );
  }

  //now check if the user voted the event\
  console.log(userId, id)
  const isVoted = await Engagement.findOne({ user: new Types.ObjectId(userId), event: new Types.ObjectId(id) }).lean();
  result.isVoted = isVoted?.voteType ? true : false;
  result.voteType = isVoted?.voteType || null;

  return result;
};

const updateEvent = async (
  user: JwtPayload,
  id: string,
  payload: Partial<IEvent>
): Promise<string> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Event ID');
  }

  const isEventExist = await Event.findById(id).populate('createdBy').populate('collaboratedWith').populate('organizedBy').lean();

  if(!isEventExist) throw new ApiError(StatusCodes.NOT_FOUND, "The requested event not found, please try again with a valid event id.")

  if(payload.winningPrize || payload.rules || payload.registrationFee ){
    if(isEventExist.currentParticipants > 0) throw new ApiError(StatusCodes.BAD_REQUEST, "You can't update the event, because there are already participants registered.")
    }
  if(isEventExist?.registrationDeadline?.getTime()! < Date.now()) throw new ApiError(StatusCodes.BAD_REQUEST, "You can't update the event, because the registration deadline has passed.")
  if(isEventExist?.startDate!.getTime() < Date.now()) throw new ApiError(StatusCodes.BAD_REQUEST, "You can't update the event, because the event has already started.")
  if(isEventExist?.endDate!.getTime() < Date.now()) throw new ApiError(StatusCodes.BAD_REQUEST, "You can't update the event, because the event has already ended.")
  


  const result = await Event.findByIdAndUpdate(
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
      'Something went wrong while updating event, please try again with valid id.'
    );
  }

  
  return "Event updated successfully.";
};

const deleteEvent = async (user: JwtPayload, id: string): Promise<string> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Event ID');
  }

  const isEventExist = await Event.findById(id);
  if(!isEventExist) throw new ApiError(StatusCodes.NOT_FOUND, "The requested event not found, please try again with a valid event id.")
  if(isEventExist?.currentParticipants > 0) throw new ApiError(StatusCodes.BAD_REQUEST, "You can't delete the event, because there are already participants registered.")
  if(isEventExist?.registrationDeadline?.getTime()! < Date.now()) throw new ApiError(StatusCodes.BAD_REQUEST, "You can't delete the event, because the registration deadline has passed.")
  if(isEventExist?.startDate!.getTime() < Date.now()) throw new ApiError(StatusCodes.BAD_REQUEST, "You can't delete the event, because the event has already started.")
  if(isEventExist?.endDate!.getTime() < Date.now()) throw new ApiError(StatusCodes.BAD_REQUEST, "You can't delete the event, because the event has already ended.")
  if(isEventExist?.createdBy?._id.toString() !== user.authId) throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to delete this event.")

  const result = await Event.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Something went wrong while deleting event, please try again with valid id.'
    );
  }

  return "Event deleted successfully.";
};









const getEventWithStepInfo = async (id: string): Promise<IEvent> => {
  const result = await Event.findById(id)
    .populate('categories', 'name')
    .populate('organizedBy', 'name email')
    .populate('collaboratedWith', 'name email')
    .populate('createdBy', 'name email');

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found');
  }

  return result;
};


const getClubsEvents = async (  filterables: IEventFilterables,
  pagination: IPaginationOptions,
  userId: string)=>{
   const { searchTerm, ...filterData } = filterables;
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  // Only show active events by default
  // andConditions.push({ isActive: true });

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: eventSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filter functionality
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  andConditions.push({
    createdBy: new Types.ObjectId(userId),
  })

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const [result, total] = await Promise.all([
    Event
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }).populate('createdBy').populate('organizedBy').lean(),
    Event.countDocuments(whereConditions),
    
  ]);

  const votedEvents = await Engagement.find({ user: new Types.ObjectId(userId), event: { $in: result.map((event) => event._id) } }).lean();

  //now append isVoted with vote type in the result
  result.forEach((event) => {
    const isVoted = votedEvents.find((vote) => vote.event.toString() === event._id.toString());
    event.isVoted = isVoted?.voteType ? true : false;
    event.voteType = isVoted?.voteType || null;
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
}

export const EventServices = {

  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  createEvent,
  getClubsEvents,

  getEventWithStepInfo,
};