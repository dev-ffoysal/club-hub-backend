import { Model, Types } from 'mongoose';

export interface IUniversityFilterables {
  searchTerm?: string;
  name?: string;
  logo?: string;
  description?: string;
}

export interface IUniversity {
  _id: Types.ObjectId;
  name: string;
  logo: string;
  isDeleted: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UniversityModel = Model<IUniversity, {}, {}>;
