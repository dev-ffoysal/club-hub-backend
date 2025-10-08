import { Schema, model } from 'mongoose';
import { ICategory, CategoryModel } from './category.interface'; 

const categorySchema = new Schema<ICategory, CategoryModel>({
  title: { type: String },
  slug: { type: String },
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Category = model<ICategory, CategoryModel>('Category', categorySchema);
