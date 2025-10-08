
import z from 'zod';
import { PaymentMode } from '../../../enum/payment';


const getClubJoiningUrlSchema = z.object({
  query: z.object({
    PaymentMode: z.nativeEnum(PaymentMode, {
      required_error: 'Payment mode is required',
    }),
  }),
})

const generateEventJoiningUrlSchema = z.object({
  query: z.object({
    eventId: z.string({
      required_error: 'Event id is required',
    }),
    type: z.string(z.enum(['meet', 'registration', 'both'])),
  }),
})

export const ClubValidations = {
  getClubJoiningUrlSchema,
  generateEventJoiningUrlSchema,
}