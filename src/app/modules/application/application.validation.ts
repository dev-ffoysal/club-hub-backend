import { z } from 'zod';

export const ApplicationValidations = {
  create: z.object({
    body: z.object({
      clubName: z.string({ required_error: 'Club name is required' }),
      university: z.string({ required_error: 'University is required' }),
      clubPurpose: z.string({ required_error: 'Club purpose is required' }),
      description: z.string({ required_error: 'Description is required' }),
      clubPhone: z.string({ required_error: 'Club phone is required' }),
      clubEmail: z.string({ required_error: 'Club email is required' }),
      applicantName: z.string({ required_error: 'Applicant name is required' }),
      applicantEmail: z.string({ required_error: 'Applicant email is required' }),
    }),
  }),

  update: z.object({

  body: z.object({
    status: z.enum(['approved', 'rejected']),
    reason: z.string().optional(),
  }),
  params: z.object({
    id: z.string({ required_error: 'Application id is required' }),
  }),
}),


};
