import { z } from 'zod';

export const CategoryValidations = {
  create: z.object({
    body: z.object({
      title: z.string({
        required_error: 'Title is required',
      }),
    }),

  }),

  update: z.object({
    body: z.object({
      title: z.string().optional(),
    }),
    params: z.object({
      id: z.string({
        required_error: 'ID is required',
      }),
    }),

  }),
  delete: z.object({
    params: z.object({
      id: z.string({
        required_error: 'ID is required',
      }),
    }),
  }),
};
