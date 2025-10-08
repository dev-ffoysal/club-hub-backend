import { Request, Response } from 'express';
import { FollowServices } from './follow.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { followFilterables } from './follow.constants';
import { paginationFields } from '../../../interfaces/pagination';
import { JwtPayload } from 'jsonwebtoken';

const createOrRemoveFollow = catchAsync(async (req: Request, res: Response) => {
  const clubId = req.params.clubId;
  const userId = (req.user as JwtPayload).authId;

  const result = await FollowServices.createOrRemoveFollow(
    userId,
    clubId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.isFollowing ? 'Followed successfully' : 'Unfollowed successfully',
    data: result,
  });
});



const getAllFollows = catchAsync(async (req: Request, res: Response) => {

  const pagination = pick(req.query, paginationFields);

  const result = await FollowServices.getAllFollows(
    req.user!,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Follows retrieved successfully',
    data: result,
  });
});


export const FollowController = {
  createOrRemoveFollow,
  getAllFollows,

};