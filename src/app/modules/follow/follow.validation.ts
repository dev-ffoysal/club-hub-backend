import { z } from 'zod';

export const FollowValidations = {
  createOrRemove: z.object({
    params: z.object({
      clubId: z.string(),
    }),
  }),


};
