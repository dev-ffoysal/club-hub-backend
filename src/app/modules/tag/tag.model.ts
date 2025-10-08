import { Schema, model } from 'mongoose';
import { ITag, TagModel } from './tag.interface'; 

const tagSchema = new Schema<ITag, TagModel>({
  title: { type: String },
}, {
  timestamps: true
});

export const Tag = model<ITag, TagModel>('Tag', tagSchema);
