import { Schema, model } from 'mongoose';
import { ICommitte, CommitteModel } from './committe.interface'; 


const membersItemSchema = new Schema({
  member: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: String, required: true },
  note: { type: String },
}, { _id: true });

const committeSchema = new Schema<ICommitte, CommitteModel>({
  club: { type: Schema.Types.ObjectId, ref: 'User', required: true,populate:{
    path:'club',
    select:'name email profile cover clubName'
  } },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  members: [membersItemSchema],
  status: { type: String, default: 'active' },
}, {
  timestamps: true
});

export const Committe = model<ICommitte, CommitteModel>('Committe', committeSchema);
