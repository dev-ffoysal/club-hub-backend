import { Model, Types } from 'mongoose';

export interface IAchievement {
  _id: Types.ObjectId;
  club: Types.ObjectId;
  images: string[];
  title: string;
  description: string;
  subTitle: string;
  date: Date;
  teams: Types.ObjectId[];
  subDescription: string;
  tags: string[];
  event?: Types.ObjectId | string;
  organizedBy?: {
    name:string,
    image:string,
    title:string,
    description:string,
    email:string,
    phone:string,
    website:string,

  };
}

export type AchievementModel = Model<IAchievement, {}, {}>;
