import { Request, Response } from 'express';
import { EngagementServices } from './engagement.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';


import { VoteType } from './engagement.interface';

const upOrDownVote = catchAsync(async (req: Request, res: Response) => {
  const { voteType } = req.body as { voteType: VoteType };
  const eventId = req.params.id;

  const result = await EngagementServices.upOrDownVote(
    req.user!,
    eventId,
    voteType
  );


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.isVoted 
      ? `${voteType === 'upvote' ? 'Upvoted' : 'Downvoted'} successfully.`
      : `${voteType === 'upvote' ? 'Upvote' : 'Downvote'} removed successfully.`,
    data: result,
  });
});



export const EngagementController = {
  upOrDownVote,
};