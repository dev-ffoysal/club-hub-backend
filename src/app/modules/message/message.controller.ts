import { Request, Response } from 'express';
import { MessageServices } from './message.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { messageFilterables } from './message.constants';
import { paginationFields } from '../../../interfaces/pagination';

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const messageData = req.body;

  const result = await MessageServices.sendMessage(
    req.user!,
    chatId,
    messageData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Message created successfully',
    data: result,
  });
});


const getMessageByChatId = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const pagination = pick(req.query, paginationFields);

  const result = await MessageServices.getMessageByChatId(
    req.user!,
    chatId,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});



export const MessageController = {
  sendMessage,
  getMessageByChatId,

};