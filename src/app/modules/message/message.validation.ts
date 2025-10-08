import { z } from 'zod';

export const MessageValidations = {
  create: z.object({
    body: z.object({
      message: z.string(),
    }),
    params: z.object({
      chatId: z.string(),
    }),

  }),

  update: z.object({
    body: z.object({
      message: z.string(),
    }),
    params: z.object({
      chatId: z.string(),
    }),
  }),

  get: z.object({
    params: z.object({
      chatId: z.string(),
    }),
  }),
};
