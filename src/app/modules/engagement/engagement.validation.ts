import { z } from 'zod';
import { VoteType } from './engagement.interface';

const voteTypeSchema = z.enum(['upvote', 'downvote'] as const, {
  errorMap: () => ({ message: 'Vote type must be either "upvote" or "downvote"' })
});

export const EngagementValidations = {
  upOrDownVote: z.object({
    body: z.object({
      voteType: voteTypeSchema,
    }),
    params: z.object({
      id: z.string().min(1, 'Event ID is required'),
    }),
  }),

  getUserVoteStatus: z.object({
    params: z.object({
      id: z.string().min(1, 'Event ID is required'),
    }),
  }),

  getEventVoteStats: z.object({
    params: z.object({
      id: z.string().min(1, 'Event ID is required'),
    }),
  }),
};
