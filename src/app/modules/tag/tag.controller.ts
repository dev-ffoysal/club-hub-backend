import { Request, Response } from 'express';
import { TagServices } from './tag.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { tagFilterables } from './tag.constants';
import { paginationFields } from '../../../interfaces/pagination';

const createTag = catchAsync(async (req: Request, res: Response) => {
  const tagData = req.body;

  const result = await TagServices.createTag(
    req.user!,
    tagData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Tag created successfully',
    data: result,
  });
});

const updateTag = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const tagData = req.body;

  const result = await TagServices.updateTag(id, tagData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tag updated successfully',
    data: result,
  });
});



const getAllTags = catchAsync(async (req: Request, res: Response) => {

  const result = await TagServices.getAllTags(
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tags retrieved successfully',
    data: result,
  });
});

const deleteTag = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TagServices.deleteTag(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Tag deleted successfully',
    data: result,
  });
});

export const TagController = {
  createTag,
  updateTag,
  getAllTags,
  deleteTag,
};