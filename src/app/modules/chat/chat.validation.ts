import { z } from 'zod';

export const ChatValidations = {
  create: z.object({
    participants: z.array(z.string()),
    club: z.string(),
    isGroupChat: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),

  update: z.object({
    participants: z.array(z.string()).optional(),
    club: z.string().optional(),
    isGroupChat: z.boolean().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  }),
};
