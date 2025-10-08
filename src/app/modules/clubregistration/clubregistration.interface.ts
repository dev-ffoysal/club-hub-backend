import { Model, Types } from 'mongoose';
import { IPaymentInfo, PAYMENT_STATUS } from '../eventRegistration';
import { CLUB_REGISTRATION_STATUS } from './clubregistration.constants';
import { IUser } from '../user/user.interface';

export interface IClubregistration {
  _id: Types.ObjectId;
  club: Types.ObjectId | IUser;
  member: Types.ObjectId | IUser;
  isPaymentRequired: boolean;
  paymentStatus?: PAYMENT_STATUS;
  paymentInfo?: IPaymentInfo
  isApprovedByClub: boolean;
  status: CLUB_REGISTRATION_STATUS;
  isCreatedByAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ClubregistrationModel = Model<IClubregistration, {}, {}>;


export interface IClubregistrationFilterables {
  searchTerm?:string;
  club?: Types.ObjectId;
  member?: Types.ObjectId;
  isPaymentRequired?: boolean;
  paymentStatus?: PAYMENT_STATUS;
  isApprovedByClub?: boolean;
  status?: CLUB_REGISTRATION_STATUS;
  isCreatedByAdmin?: boolean;
}