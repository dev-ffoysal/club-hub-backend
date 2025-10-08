import { z } from 'zod';
import { PARTICIPATION_STATUS } from './eventRegistration.interface';

const markSingleParticipationZodSchema = z.object({
  body: z.object({
    participated: z.boolean({
      required_error: 'Participated status is required'
    })
  }),
  params: z.object({
    registrationId: z.string({
      required_error: 'Registration ID is required'
    })
  })
});

const markBulkParticipationZodSchema = z.object({
  body: z.object({
    registrationIds: z.array(z.string(), {
      required_error: 'Registration IDs are required'
    }).min(1, 'At least one registration ID is required'),
    participated: z.boolean({
      required_error: 'Participated status is required'
    })
  })
});

const getEventParticipantsZodSchema = z.object({
  params: z.object({
    eventId: z.string({
      required_error: 'Event ID is required'
    })
  }),
  query: z.object({
    participationStatus: z.enum([PARTICIPATION_STATUS.PARTICIPATED, PARTICIPATION_STATUS.NOT_PARTICIPATED]).optional()
  }).optional()
});

const getParticipationStatsZodSchema = z.object({
  params: z.object({
    eventId: z.string({
      required_error: 'Event ID is required'
    })
  })
});

export const ParticipationValidation = {
  markSingleParticipationZodSchema,
  markBulkParticipationZodSchema,
  getEventParticipantsZodSchema,
  getParticipationStatsZodSchema
};