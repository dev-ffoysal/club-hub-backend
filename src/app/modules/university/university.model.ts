import { Schema, model } from 'mongoose';
import { IUniversity, UniversityModel } from './university.interface'; 

const universitySchema = new Schema<IUniversity, UniversityModel>({
  name: { type: String },
  logo: { type: String },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
}, {
  timestamps: true
});

export const University = model<IUniversity, UniversityModel>('University', universitySchema);
