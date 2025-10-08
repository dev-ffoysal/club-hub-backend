import { z } from 'zod';

const membersItemSchema = z.object({
  member: z.string({
    required_error: 'Member is required',
  }),
  position: z.string({
    required_error: 'Position is required',
  }),
  note: z.string().optional(),
});

export const CommitteValidations = {
  create: z.object({
    body: z.object({
      from: z.string({
        required_error: 'From is required',
      }),
      to: z.string({
        required_error: 'To is required',
      }),
      members: z.array(membersItemSchema),
    }),

  }),

  update: z.object({
    body: z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      members: z.array(membersItemSchema),
    }),
    params: z.object({
      id: z.string({
        required_error: 'ID is required',
      }),
    }),
    query: z.object({
      status: z.string().optional(),
      year: z.string().optional(),
    }),
  }),
  changeStatus: z.object({
    params: z.object({
      id: z.string({
        required_error: 'ID is required',
      }),
    }),
  }),
};
