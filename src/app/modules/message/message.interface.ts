import { Model, Types } from 'mongoose';
import { IChat } from '../chat/chat.interface';
import { IUser } from '../user/user.interface';

export interface IMessageFilterables {
  searchTerm?: string;
  message?: string;
}

export interface IMessage {
  _id: Types.ObjectId;
  chat: Types.ObjectId | IChat;
  sender: Types.ObjectId | IUser;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageModel = Model<IMessage, {}, {}>;
