import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export enum MEETING_STATUS {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export enum PARTICIPANT_STATUS {
  INVITED = 'invited',
  JOINED = 'joined',
  LEFT = 'left',
  KICKED = 'kicked'
}

export enum PARTICIPANT_ROLE {
  HOST = 'host',
  MODERATOR = 'moderator',
  PARTICIPANT = 'participant'
}

export interface IMediaSettings {
  video: boolean;
  audio: boolean;
  screenShare: boolean;
}

export interface IParticipant {
  _id: Types.ObjectId;
  user?: Types.ObjectId | IUser;
  guestName?: string;
  role: PARTICIPANT_ROLE;
  status: PARTICIPANT_STATUS;
  mediaSettings: IMediaSettings;
  joinedAt?: Date;
  leftAt?: Date;
  socketId?: string;
  peerId?: string;
}

export interface IMeeting {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  host: Types.ObjectId | IUser;
  participants: IParticipant[];
  status: MEETING_STATUS;
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // in minutes
  maxParticipants?: number;
  isRecording: boolean;
  recordingUrl?: string;
  meetingCode: string;
  password?: string;
  isPublic: boolean;
  allowGuests: boolean;
  waitingRoom: boolean;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  settings: {
    muteOnJoin: boolean;
    videoOnJoin: boolean;
    allowParticipantScreenShare: boolean;
    allowParticipantChat: boolean;
  };
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  addParticipant(participant: Partial<IParticipant>): Promise<IMeeting>;
  removeParticipant(participantId: string): Promise<IMeeting>;
  updateParticipantMedia(participantId: string, mediaSettings: Partial<IMediaSettings>): Promise<IMeeting>;
  startMeeting(): Promise<IMeeting>;
  endMeeting(): Promise<IMeeting>;
}

export interface IMeetingFilterables {
  searchTerm?: string;
  host?: string;
  status?: MEETING_STATUS;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
}

// WebRTC Signaling interfaces
export interface ISignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room' | 'user-joined' | 'user-left' | 'media-toggle';
  payload: any;
  from?: string;
  to?: string;
  targetSocketId?: string;
  fromSocketId?: string;
  roomId: string;
  offer?: any;
  answer?: any;
  candidate?: any;
}

export interface IRoomParticipant {
  socketId: string;
  userId?: string;
  guestName?: string;
  peerId: string;
  mediaSettings: {
    camera: boolean;
    microphone: boolean;
    screenShare: boolean;
  };
  joinedAt: Date;
}

export interface IRoom {
  id: string;
  meetingId?: string;
  participants: Map<string, IRoomParticipant>;
  host: string;
  createdAt: Date;
}

// Static methods interface
export interface IMeetingStatics {
  findByMeetingCode(code: string): Promise<IMeeting | null>;
  findByHost(hostId: string): Promise<IMeeting[]>;
  findActiveMeetings(): Promise<IMeeting[]>;
  findScheduledMeetings(): Promise<IMeeting[]>;
}

export type MeetingModel = Model<IMeeting> & IMeetingStatics;