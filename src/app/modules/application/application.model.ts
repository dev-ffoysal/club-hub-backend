import { Schema, model } from 'mongoose';
import { IApplication, ApplicationModel } from './application.interface'; 
import { Types } from 'mongoose';
import { APPLICATION_STATUS } from '../../../enum/user';

const applicationSchema = new Schema<IApplication, ApplicationModel>({
  clubName: { type: String },
  categories: { type: [Schema.Types.ObjectId], ref: 'Category', populate: {
    path: 'categories',
    select: 'title'
  } },
  university: { type: String },
  clubPurpose: { type: String, required: true },
  description: { type: String, required: true },
  clubPhone: { type: String, required: true },
  clubEmail: { type: String, required: true },
  status: { type: String, default: APPLICATION_STATUS.PENDING },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  createdClub: { type: Schema.Types.ObjectId, ref: 'Club' },
  rejectedReason: { type: String },
}, {
  timestamps: true
});

export const Application = model<IApplication, ApplicationModel>('Application', applicationSchema);
