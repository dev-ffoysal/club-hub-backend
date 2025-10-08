import { Model, Types } from 'mongoose';
import { APPLICATION_STATUS } from '../../../enum/user';

export interface IApplicationFilterables {
  searchTerm?: string;
  clubName?: string;
  university?: string;
  clubPurpose?: string;
  description?: string;
  clubPhone?: string;
  clubEmail?: string;
  applicantName?: string;
  applicantEmail?: string;
}

export interface IApplication {
  _id: Types.ObjectId;
  clubName: string;
  university: string;
  clubPurpose: string;
  description: string;
  clubPhone: string;
  clubEmail: string;
  status: APPLICATION_STATUS.PENDING | APPLICATION_STATUS.APPROVED | APPLICATION_STATUS.REJECTED;
  applicantName: string;
  applicantEmail: string;
  createdClub: Types.ObjectId | string;
  rejectedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationModel = Model<IApplication, {}, {}>;
