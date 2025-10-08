import { Schema, model } from 'mongoose';
import { IFollow, FollowModel } from './follow.interface'; 

const followSchema = new Schema<IFollow, FollowModel>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  club: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

export const Follow = model<IFollow, FollowModel>('Follow', followSchema);
