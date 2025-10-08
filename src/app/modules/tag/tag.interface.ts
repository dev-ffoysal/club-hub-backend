import { Model, Types } from 'mongoose';

export interface ITagFilterables {
  searchTerm?: string;
  title?: string;
}

export interface ITag {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TagModel = Model<ITag, {}, {}>;
