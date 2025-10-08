import { z } from 'zod';

export const TagValidations = {
  create: z.object({
   body:z.object({
     title: z.string({
      required_error: 'Title is required',
     }),
   })
   
  }),

  update: z.object({
    body:z.object({
      title: z.string().optional(),
    }),
    params: z.object({
      id: z.string().min(1, 'Tag ID is required'),
    }),
  }),
};
