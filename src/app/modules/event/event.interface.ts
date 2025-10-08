import { Model, Types } from 'mongoose';
import { EVENT_TYPE } from '../../../enum/event';
import { IUser } from '../user/user.interface';
import { ICategory } from '../category/category.interface';
import { VoteType } from '../engagement/engagement.interface';

export interface IEventFilterables {
  searchTerm?: string;
  type?: EVENT_TYPE;
  isPublic?: boolean;
  isOnline?: boolean;
  createdBy?: string;
  organizedBy?: string;
  startDate?: string;
  endDate?: string;
}

export interface IEvent {
  _id: Types.ObjectId;
  createdBy: Types.ObjectId | IUser;
  categories: Types.ObjectId[] | ICategory[];
  title:string
  slogan?:string
  description?:string
  startDate: Date;
  endDate: Date;
  time?:string
  images?:string[]
  cover?:string
  location: string;
  isOnline: boolean;
  isFixedSeat: boolean;
  registrationFee?: number;
  meetingLink?: string;
  maxParticipants?: number;
  currentParticipants: number;
  registrationDeadline?: Date;
  isPublic: boolean;
  commentsEnabled: boolean;
  followersCount: number;
  upVotesCount: number;
  downVotesCount: number;
  type: EVENT_TYPE;
  tags: string[];
  organizedBy?: Types.ObjectId | IUser;
  isActive: boolean;
  host?: {
    name: string;
    designation?: string;
    position?: string;
    image?: string;
  }[];
  winningPrize?: {
    title: string;
    description?: string;
    amount?: number;
    position?: number;
  }[];
  guests?: {
    name: string;
    designation?: string;
    position?: string;
    image?: string;
  }[];
  benefits?: {
    title: string;
    description?: string;
    criteria?: string[];
  }[];
  requirements?: {
    title: string;
    description?: string;
    criteria?: string[];
  }[];
  rules?: {
    title: string;
    description?: string;
    criteria?: string[];
  }[];
  eligibility?: {
    title: string;
    description?: string;
    criteria?: string[];
  }[];
  sponsors?: {
    name: string;
    image?: string;
    website?: string;
    sponsorType?: string;
  }[];
  instructions?: {
    title: string;
    description?: string;
    criteria?: string[];
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  isVoted?: boolean;
  voteType?: VoteType | null;
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<IEvent, {}, {}>;
