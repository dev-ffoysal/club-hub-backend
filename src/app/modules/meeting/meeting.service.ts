

import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';


import { IGenericResponse } from '../../../interfaces/response';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Meeting } from './meeting.model';
import { IMeeting, IMeetingFilterables, MEETING_STATUS, PARTICIPANT_STATUS, PARTICIPANT_ROLE, IParticipant, IRoom, IRoomParticipant } from './meeting.interface';
import { meetingSearchableFields, meetingFilterableFields, meetingPopulateFields } from './meeting.constants';
import { generateUniqueCode } from '../../../utils/codeGenerator';
import { StatusCodes } from 'http-status-codes';
import { paginationHelper } from '../../../helpers/paginationHelper';

// In-memory room management (consider using Redis for production)
const activeRooms = new Map<string, IRoom>();

class MeetingService {
  // Meeting CRUD operations
  async createMeeting(meetingData: Partial<IMeeting>): Promise<IMeeting> {
    // Generate unique meeting code if not provided
    if (!meetingData.meetingCode) {
      meetingData.meetingCode = await generateUniqueCode();
    }

    // Ensure meeting code is unique
    const existingMeeting = await Meeting.findByMeetingCode(meetingData.meetingCode);
    if (existingMeeting) {
      throw new ApiError(StatusCodes.CONFLICT, 'Meeting code already exists');
    }

    const meeting = await Meeting.create(meetingData);
    return await meeting.populate(meetingPopulateFields);
  }

  async getAllMeetings(
    filters: IMeetingFilterables,
    paginationOptions: IPaginationOptions
  ): Promise<IGenericResponse<IMeeting[]>> {
    const { searchTerm, startDate, endDate, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(paginationOptions);

    const andConditions = [];

    // Search term condition
    if (searchTerm) {
      andConditions.push({
        $or: meetingSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i'
          }
        }))
      });
    }

    // Date range filter
    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }
      andConditions.push({ createdAt: dateFilter });
    }

    // Other filters
    Object.entries(filterData).forEach(([key, value]) => {
      if (value !== undefined && meetingFilterableFields.includes(key)) {
        andConditions.push({ [key]: value });
      }
    });

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }

    const result = await Meeting.find(whereConditions)
      .populate(meetingPopulateFields)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await Meeting.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit)
      },
      data: result
    };
  }

  async getMeetingById(id: string): Promise<IMeeting | null> {
    const result = await Meeting.findById(id).populate(meetingPopulateFields);
    return result;
  }

  async getMeetingByCode(code: string): Promise<IMeeting | null> {
    const result = await Meeting.findByMeetingCode(code);
    return result;
  }

  async updateMeeting(id: string, payload: Partial<IMeeting>): Promise<IMeeting | null> {
    const result = await Meeting.findByIdAndUpdate(id, payload, { new: true })
      .populate(meetingPopulateFields);
    return result;
  }

  async deleteMeeting(id: string): Promise<IMeeting | null> {
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
    }

    // End meeting if it's active
    if (meeting.status === MEETING_STATUS.ACTIVE) {
      await meeting.endMeeting();
    }

    const result = await Meeting.findByIdAndDelete(id);
    return result;
  }

  // Meeting control operations
  async startMeeting(meetingId: string, hostId: string): Promise<IMeeting> {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
    }

    if (meeting.host.toString() !== hostId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Only the host can start the meeting');
    }

    if (meeting.status !== MEETING_STATUS.SCHEDULED) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Meeting cannot be started');
    }

    return await meeting.startMeeting();
  }

  async endMeeting(meetingId: string, hostId: string): Promise<IMeeting> {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
    }

    if (meeting.host.toString() !== hostId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Only the host can end the meeting');
    }

    if (meeting.status !== MEETING_STATUS.ACTIVE) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Meeting is not active');
    }

    // Remove room from active rooms
    activeRooms.delete(meetingId);

    return await meeting.endMeeting();
  }

  // Participant management
  async joinMeeting(
    meetingCode: string, 
    participantData: { userId?: string; guestName?: string; socketId: string; peerId: string }
  ): Promise<{ meeting: IMeeting; participant: IParticipant }> {
    const meeting = await Meeting.findByMeetingCode(meetingCode);
    if (!meeting) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
    }

    if (meeting.status === MEETING_STATUS.ENDED || meeting.status === MEETING_STATUS.CANCELLED) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Meeting has ended or been cancelled');
    }

    // Check participant limit
    const activeParticipants = meeting.participants.filter(p => p.status === PARTICIPANT_STATUS.JOINED);
    if (activeParticipants.length >= (meeting.maxParticipants || 50)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Meeting is full');
    }

    // Check if guest is allowed
    if (!participantData.userId && !meeting.allowGuests) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Guests are not allowed in this meeting');
    }

    const participant: Partial<IParticipant> = {
      user: participantData.userId ? new mongoose.Types.ObjectId(participantData.userId) : undefined,
      guestName: participantData.guestName,
      role: meeting.host.toString() === participantData.userId ? PARTICIPANT_ROLE.HOST : PARTICIPANT_ROLE.PARTICIPANT,
      status: PARTICIPANT_STATUS.JOINED,
      joinedAt: new Date(),
      socketId: participantData.socketId,
      peerId: participantData.peerId,
      mediaSettings: {
        video: meeting.settings.videoOnJoin,
        audio: !meeting.settings.muteOnJoin,
        screenShare: false
      }
    };

    const updatedMeeting = await meeting.addParticipant(participant);
    const addedParticipant = updatedMeeting.participants[updatedMeeting.participants.length - 1];

    return { meeting: updatedMeeting, participant: addedParticipant };
  }

  async leaveMeeting(
    meetingId: string, 
    participantId: string
  ): Promise<IMeeting> {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Meeting not found');
    }

    const participant = meeting.participants.find(p => p._id.toString() === participantId);
    if (participant) {
      participant.status = PARTICIPANT_STATUS.LEFT;
      participant.leftAt = new Date();
      await meeting.save();
    }

    return meeting;
  }

  // Room management for WebRTC
  createRoom(meetingId: string, hostSocketId: string): IRoom {
    const room: IRoom = {
      id: meetingId,
      meetingId,
      participants: new Map(),
      host: hostSocketId,
      createdAt: new Date()
    };

    activeRooms.set(meetingId, room);
    return room;
  }

  getRoom(roomId: string): IRoom | undefined {
    return activeRooms.get(roomId);
  }

  addParticipantToRoom(roomId: string, participant: IRoomParticipant): void {
    const room = activeRooms.get(roomId);
    if (room) {
      room.participants.set(participant.socketId, participant);
    }
  }

  removeParticipantFromRoom(roomId: string, socketId: string): void {
    const room = activeRooms.get(roomId);
    if (room) {
      room.participants.delete(socketId);
      
      // Remove room if no participants left
      if (room.participants.size === 0) {
        activeRooms.delete(roomId);
      }
    }
  }

  getRoomParticipants(roomId: string): IRoomParticipant[] {
    const room = activeRooms.get(roomId);
    return room ? Array.from(room.participants.values()) : [];
  }

  updateParticipantMedia(roomId: string, socketId: string, mediaSettings: Partial<any>): void {
    const room = activeRooms.get(roomId);
    if (room && room.participants.has(socketId)) {
      const participant = room.participants.get(socketId)!;
      Object.assign(participant.mediaSettings, mediaSettings);
    }
  }

  // Statistics
  async getMeetingStats(hostId: string): Promise<any> {
    const totalMeetings = await Meeting.countDocuments({ host: hostId });
    const activeMeetings = await Meeting.countDocuments({ host: hostId, status: MEETING_STATUS.ACTIVE });
    const scheduledMeetings = await Meeting.countDocuments({ host: hostId, status: MEETING_STATUS.SCHEDULED });
    const completedMeetings = await Meeting.countDocuments({ host: hostId, status: MEETING_STATUS.ENDED });

    return {
      totalMeetings,
      activeMeetings,
      scheduledMeetings,
      completedMeetings
    };
  }
}

export const meetingService = new MeetingService();