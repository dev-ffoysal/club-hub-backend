import { z } from 'zod';
import { CLUB_REGISTRATION_STATUS } from './clubregistration.constants';
import { PAYMENT_STATUS, PAYMENT_METHOD } from '../eventRegistration';

const paymentInfoSchema = z.object({
  method: z.nativeEnum(PAYMENT_METHOD),
  transactionId: z.string(),
  amount: z.number(),
  currency: z.string(),
  gatewayResponse: z.any().optional(),
  processedAt: z.string().optional()
}).optional();

const createClubregistrationZodSchema = z.object({
  body: z.object({
    club: z.string().min(1, 'Club ID is required'),
    member: z.string().optional(), // Only for admin/club creating for others
  })
});

const updateClubregistrationZodSchema = z.object({
  body: z.object({
    status: z.nativeEnum(CLUB_REGISTRATION_STATUS),
  }),
  params: z.object({
    id: z.string().min(1, 'Clubregistration ID is required')
  })
});

// Payment success callback validation
const paymentSuccessZodSchema = z.object({
  body: z.object({
    mer_txnid: z.string().min(1, 'Merchant transaction ID is required'),
    pay_status: z.string().min(1, 'Payment status is required'),
    amount: z.string().min(1, 'Amount is required'),
    pay_time: z.string().optional(),
    cus_name: z.string().optional(),
    cus_email: z.string().optional(),
    cus_phone: z.string().optional(),
    currency: z.string().optional(),
    bank_txn: z.string().optional(),
    card_type: z.string().optional(),
    failed_reason: z.string().optional(),
    opt_a: z.string().optional(),
    opt_b: z.string().optional(),
    opt_c: z.string().optional(),
    opt_d: z.string().optional()
  })
});

// Payment fail callback validation
const paymentFailZodSchema = z.object({
  body: z.object({
    mer_txnid: z.string().min(1, 'Merchant transaction ID is required'),
    pay_status: z.string().min(1, 'Payment status is required'),
    failed_reason: z.string().optional(),
    opt_a: z.string().optional(),
    opt_b: z.string().optional(),
    opt_c: z.string().optional(),
    opt_d: z.string().optional()
  })
});

export const ClubregistrationValidations = {
  createClubregistrationZodSchema,
  updateClubregistrationZodSchema,
  paymentSuccessZodSchema,
  paymentFailZodSchema,
  // Legacy support
  create: createClubregistrationZodSchema,
  update: updateClubregistrationZodSchema
};
