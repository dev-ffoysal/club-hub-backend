import { z } from 'zod';

export const PaymentValidations = {
  create: z.object({
    club: z.string(),
    event: z.string().optional(),
    amount: z.number(),
    status: z.string(),
    mode: z.string(),
    user: z.string(),
    type: z.string(),
  }),

  update: z.object({
    club: z.string().optional(),
    event: z.string().optional(),
    amount: z.number().optional(),
    status: z.string().optional(),
    mode: z.string().optional(),
    user: z.string().optional(),
    type: z.string().optional(),
  }),
};
