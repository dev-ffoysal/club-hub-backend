import { z } from 'zod';

export const UniversityValidations = {
  create: z.object({
    body: z.object({
      name: z.string({
        required_error: 'Name is required',
      }),
      images: z.array(z.string()).optional(),
      description: z.string(),
    }),

  }),

  update: z.object({
    body: z.object({
      name: z.string().optional(),
      images: z.array(z.string()).optional(),
      description: z.string().optional(),
      isDeleted: z.boolean().optional(),
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
