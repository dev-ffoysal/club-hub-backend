import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import {  IMessage } from './message.interface';
import { Message } from './message.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { Types } from 'mongoose';
import { Chat } from '../chat/chat.model';


const sendMessage = async (
  user: JwtPayload,
  chatId: string,
  payload: IMessage
): Promise<string> => {

  const isChatExist = await Chat.findById(chatId);
  if (!isChatExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Chat not found, please try again with valid data.'
    );
  }

  if(isChatExist.participants.find((item)=>item.toString() === user.authId.toString())){
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You are not authorized to send message in this chat, please try again with valid data.'
    );
  }
  payload.sender = user.authId;
  const result = await Message.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create Message, please try again with valid data.'
    );
  }

  //emit message socket to chat with populated sender
  return "Message sent successfully.";
};

const getMessageByChatId = async (
  user: JwtPayload,
  chatId: string,
  pagination: IPaginationOptions
) => {
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const [result,total] = await Promise.all([
    Message.find({chat:chatId}).skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).populate('chat').populate('sender').lean(),
    Message.find({chat:chatId}).countDocuments()
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };

  
};




export const MessageServices = {
  sendMessage,
  getMessageByChatId,

};