import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface IChat {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  club: Types.ObjectId | IUser;
  isCommitteeChat: boolean;
  committee?: Types.ObjectId;
  groupName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ChatModel = Model<IChat, {}, {}>;
