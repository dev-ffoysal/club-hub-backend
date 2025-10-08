import { Model, Types } from 'mongoose';
import { PaymentStatus } from 'twilio/lib/rest/api/v2010/account/call/payment';
import { PaymentMode, PaymentType } from '../../../enum/payment';

export interface IPayment {
  _id: Types.ObjectId;
  club: Types.ObjectId;
  event?: Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  paymentMode: PaymentMode;
  transactionId?: string;
  user: Types.ObjectId;
  type: PaymentType;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentModel = Model<IPayment, {}, {}>;


export type IPaymentFilters = {
  searchTerm?: string;
  status?: PaymentStatus;
  paymentMode?: PaymentMode;
  type?: PaymentType;
}