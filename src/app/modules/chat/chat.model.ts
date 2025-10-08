import { Schema, model } from 'mongoose';
import { IChat, ChatModel } from './chat.interface'; 

const chatSchema = new Schema<IChat, ChatModel>({
  participants: { type: [Schema.Types.ObjectId], ref: 'User' },
  club: { type: Schema.Types.ObjectId, ref: 'User' },
  isCommitteeChat: { type: Boolean, default: false },
  groupName: { type: String, default: '' },
  committee:{type:Schema.ObjectId, ref:'Committe'}
}, {
  timestamps: true
});

export const Chat = model<IChat, ChatModel>('Chat', chatSchema);
