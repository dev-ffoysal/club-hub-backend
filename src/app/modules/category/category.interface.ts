import { Model, Types } from 'mongoose';



export interface ICategory {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryModel = Model<ICategory, {}, {}>;
