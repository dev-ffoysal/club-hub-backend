import { Schema, model } from 'mongoose';
import { IMessage, MessageModel } from './message.interface'; 

const messageSchema = new Schema<IMessage, MessageModel>({
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, populate: {path:'sender', select:{
    name:1,
    profile:1,
  }} },
  message: { type: String, required: true },
}, {
  timestamps: true
});

export const Message = model<IMessage, MessageModel>('Message', messageSchema);
