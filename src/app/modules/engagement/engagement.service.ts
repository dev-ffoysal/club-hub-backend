import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Engagement } from './engagement.model';
import mongoose, { Types } from 'mongoose';
import { Event } from '../event/event.model';
import { IEngagement, VoteType, VoteResponse } from './engagement.interface';
import { JwtPayload } from 'jsonwebtoken';


export const upOrDownVote = async (
  user: JwtPayload,
  eventId: string,
  voteType: VoteType
): Promise<VoteResponse> => {
  // Input validation
  if (!Types.ObjectId.isValid(user.authId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid user ID');
  }
  if (!Types.ObjectId.isValid(eventId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid event ID');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find existing engagement
    const existingEngagement = await Engagement.findOne({ 
      user: new Types.ObjectId(user.authId), 
      event: new Types.ObjectId(eventId) 
    }).session(session);

    let engagement: IEngagement;
    let eventUpdateQuery: Record<string, number> = {};
    let isVoted = false;

    if (!existingEngagement) {
      // First-time vote → create engagement
      const newEngagementData = {
        user: new Types.ObjectId(user.authId),
        event: new Types.ObjectId(eventId),
        voteType
      };
      
      const [createdEngagement] = await Engagement.create([newEngagementData], { session });
      engagement = createdEngagement;
      
      // Increment vote count
      eventUpdateQuery[`${voteType === 'upvote' ? 'upVotesCount' : 'downVotesCount'}`] = 1;
      isVoted = true;
    } else {
      if (existingEngagement.voteType === voteType) {
        // User clicked the same vote → remove vote (toggle off)
        existingEngagement.voteType = null;
        await existingEngagement.save({ session });
        engagement = existingEngagement;
        
        // Decrement vote count
        eventUpdateQuery[`${voteType === 'upvote' ? 'upVotesCount' : 'downVotesCount'}`] = -1;
        isVoted = false;
      } else {
        // Switch vote or vote for the first time after null
        const previousVote = existingEngagement.voteType;
        existingEngagement.voteType = voteType;
        await existingEngagement.save({ session });
        engagement = existingEngagement;
        
        // Update vote counts: increment new vote, decrement old vote (if exists)
        eventUpdateQuery[`${voteType === 'upvote' ? 'upVotesCount' : 'downVotesCount'}`] = 1;
        if (previousVote) {
          eventUpdateQuery[`${previousVote === 'upvote' ? 'upVotesCount' : 'downVotesCount'}`] = -1;
        }
        isVoted = true;
      }
    }

    // Update event vote counts and get updated event data
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      Object.keys(eventUpdateQuery).length > 0 ? { $inc: eventUpdateQuery } : {},
      { session, new: true }
    );

    if (!updatedEvent) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Event not found');
    }

    // Commit transaction
    await session.commitTransaction();
    
    // Calculate total vote count (upvotes + downvotes)
    const totalVoteCount = (updatedEvent.upVotesCount || 0) + (updatedEvent.downVotesCount || 0);

    return {
      eventId,
      isVoted,
      voteCount: totalVoteCount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};



export const EngagementServices = {
  upOrDownVote,
};