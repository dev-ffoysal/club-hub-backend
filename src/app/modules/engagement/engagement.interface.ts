import { Model, Types } from 'mongoose';
import { IEvent } from '../event/event.interface';
import { IUser } from '../user/user.interface';

export type VoteType = 'upvote' | 'downvote';

export interface IEngagement {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  event: Types.ObjectId | IEvent;
  voteType: VoteType | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEngagementFilterables {
  searchTerm?: string;
  user?: string;
  event?: string;
  voteType?: VoteType;
  startDate?: string;
  endDate?: string;
}

export interface VoteResponse {
  eventId: string;
  isVoted: boolean;
  voteCount: number;
}

export type EngagementModel = Model<IEngagement, {}, {}>;
