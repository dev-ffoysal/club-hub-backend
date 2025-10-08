import { Model, Types } from 'mongoose';
import { IEvent } from '../event/event.interface';
import { IUser } from '../user/user.interface';

export enum REGISTRATION_STATUS {
  PENDING = 'pending',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PAYMENT_METHOD {
  AMARPAY = 'amarpay',
  CARD = 'card',
  MOBILE_BANKING = 'mobile_banking'
}

export enum USER_TYPE {
  REGISTERED = 'registered',
  PUBLIC = 'public'
}

export enum PARTICIPATION_STATUS {
  NOT_PARTICIPATED = 'not_participated',
  PARTICIPATED = 'participated'
}

export interface IPublicUserInfo {
  name: string;
  email: string;
  phone: string;
  studentId?: string;
}

export interface IPaymentInfo {
  method: PAYMENT_METHOD;
  transactionId: string;
  amount: number;
  currency: string;
  gatewayResponse?: any;
  processedAt?: Date;
}

export interface IEventRegistration {
  _id: Types.ObjectId;
  event: Types.ObjectId | IEvent;
  user?: Types.ObjectId | IUser; // For registered users
  publicUserInfo?: IPublicUserInfo; // For public users
  userType: USER_TYPE;
  registrationCode: string; // Unique code for verification
  registrationStatus: REGISTRATION_STATUS;
  paymentStatus: PAYMENT_STATUS;
  paymentInfo?: IPaymentInfo;
  registeredAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  emailSent: boolean;
  notes?: string;
  participationStatus: PARTICIPATION_STATUS;
  participatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  markAsPaid(paymentInfo: any): Promise<IEventRegistration>;
  markAsConfirmed(): Promise<IEventRegistration>;
  cancel(reason?: string): Promise<IEventRegistration>;
  markParticipation(participated: boolean): Promise<IEventRegistration>;
}

export interface IEventRegistrationFilterables {
  searchTerm?: string;
  event?: string;
  user?: string;
  userType?: USER_TYPE;
  registrationStatus?: REGISTRATION_STATUS;
  paymentStatus?: PAYMENT_STATUS;
  participationStatus?: PARTICIPATION_STATUS;
  registrationCode?: string;
  startDate?: string;
  endDate?: string;
}

export interface IAmarPayPaymentRequest {
  eventId?: string; // For event registrations
  clubId?: string; // For club registrations
  userId?: string; // For registered users
  publicUserInfo?: IPublicUserInfo; // For public users
  club?: string; // Legacy field for club registrations
  member?: string; // Legacy field for club registrations
  amount: number;
  currency?: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
}

export interface IAmarPayResponse {
  result: string;
  payment_url: string;
  session_key: string;
  amount: string;
  currency: string;
  desc: string;
  mer_txnid: string;
}

export interface IRegistrationVerification {
  registrationCode: string;
  isValid: boolean;
  registration?: IEventRegistration;
  message: string;
}

export interface IEventRegistrationStatics {
  findByRegistrationCode(code: string): Promise<IEventRegistration | null>;
  findByEvent(eventId: string): Promise<IEventRegistration[]>;
  countByEventAndStatus(eventId: string, status: REGISTRATION_STATUS): Promise<number>;
  markBulkParticipation(registrationIds: string[], participated: boolean): Promise<any>;
  getParticipationStats(eventId: string): Promise<any[]>;
}

export type EventRegistrationModel = Model<IEventRegistration> & IEventRegistrationStatics;