import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface IAdvertisementFilterables {
  searchTerm?: string;
  title?: string;
  type?: string;
  status?: string;
  club?: string;
  startDate?: string;
  endDate?: string;
}

export enum ADVERTISEMENT_TYPE {
  CLUB_EVENT = 'club_event',
  EXTERNAL = 'external',
  GOVERNMENT = 'government',
  COMPANY = 'company',
  CONTEST = 'contest',
  INITIATIVE = 'initiative'
}

export enum ADVERTISEMENT_STATUS {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  DELETED = 'deleted'
}

export interface IAdvertisement {
  _id: Types.ObjectId;
  title: string;
  description: string;
  type: ADVERTISEMENT_TYPE;
  status: ADVERTISEMENT_STATUS;
  
  // Campaign dates
  startDate: Date;
  endDate: Date;
  
  // Media assets
  image?: string;
  banner?: string;
  video?: string;
  
  // Links and actions
  externalLink?: string;
  callToAction?: string;
  
  // Club-related fields (for club events)
  club?: Types.ObjectId | IUser;
  event?: Types.ObjectId;
  
  // External advertiser info
  advertiserName?: string;
  advertiserEmail?: string;
  advertiserPhone?: string;
  advertiserWebsite?: string;
  
  // Targeting and visibility
  targetAudience?: string[];
  universities?: Types.ObjectId[];
  departments?: string[];
  
  // Performance tracking
  impressions: number;
  clicks: number;
  budget?: number;
  costPerClick?: number;
  
  // Priority and positioning
  priority: number; // Higher number = higher priority
  position?: string; // 'banner', 'sidebar', 'feed', 'popup'
  
  // Approval and management
  createdBy: Types.ObjectId | IUser;
  approvedBy?: Types.ObjectId | IUser;
  approvedAt?: Date;
  
  // Additional metadata
  tags?: string[];
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export type AdvertisementModel = Model<IAdvertisement, {}, {}>;