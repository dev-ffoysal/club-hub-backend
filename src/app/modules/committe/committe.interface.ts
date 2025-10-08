import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface MembersItem {
  member: Types.ObjectId;
  position: string;
  note: string;
}

export interface ICommitte {
  _id: Types.ObjectId;
  club: Types.ObjectId;
  from: Date;
  to: Date;
  members: MembersItem[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export type CommitteModel = Model<ICommitte, {}, {}>;
