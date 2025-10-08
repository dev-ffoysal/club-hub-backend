import { Model, Types } from 'mongoose';

export interface IFollow {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  club: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowStatus {
  clubId: string;
  isFollowing: boolean;
  followerCount: number;
}

export type FollowModel = Model<IFollow, {}, {}>;
