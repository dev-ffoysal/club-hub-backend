import { z } from 'zod';
import { REGISTRATION_STATUS, PAYMENT_STATUS, PAYMENT_METHOD, USER_TYPE } from './eventRegistration.interface';

const publicUserInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number is too long'),
  studentId: z.string().optional()
});

const paymentInfoSchema = z.object({
  method: z.nativeEnum(PAYMENT_METHOD),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  currency: z.string().default('BDT'),
  gatewayResponse: z.any().optional(),
  processedAt: z.string().optional()
});

// Create registration for registered users
const createRegisteredUserRegistrationZodSchema = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID'),
    successUrl: z.string().url('Invalid success URL'),
    failUrl: z.string().url('Invalid fail URL'),
    cancelUrl: z.string().url('Invalid cancel URL')
  })
});

// Create registration for public users
const createPublicUserRegistrationZodSchema = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID'),
    publicUserInfo: publicUserInfoSchema,
    successUrl: z.string().url('Invalid success URL'),
    failUrl: z.string().url('Invalid fail URL'),
    cancelUrl: z.string().url('Invalid cancel URL')
  })
});

// Update registration
const updateRegistrationZodSchema = z.object({
  body: z.object({
    registrationStatus: z.nativeEnum(REGISTRATION_STATUS).optional(),
    paymentStatus: z.nativeEnum(PAYMENT_STATUS).optional(),
    paymentInfo: paymentInfoSchema.optional(),
    notes: z.string().max(500, 'Notes are too long').optional(),
    emailSent: z.boolean().optional()
  })
});

// Verify registration code
const verifyRegistrationZodSchema = z.object({
  body: z.object({
    registrationCode: z.string().min(1, 'Registration code is required')
  })
});

// Payment success callback
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
    card_no: z.string().optional(),
    store_amount: z.string().optional(),
    bank_amount: z.string().optional(),
    pg_service_charge_bdt: z.string().optional(),
    pg_service_charge_usd: z.string().optional(),
    pg_card_bank_name: z.string().optional(),
    pg_card_bank_country: z.string().optional(),
    other_currency: z.string().optional(),
    failed_reason: z.string().optional(),
    opt_a: z.string().optional(),
    opt_b: z.string().optional(),
    opt_c: z.string().optional(),
    opt_d: z.string().optional()
  })
});

// Payment fail callback
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

// Get registrations with filters
const getRegistrationsZodSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    searchTerm: z.string().optional(),
    event: z.string().optional(),
    user: z.string().optional(),
    userType: z.nativeEnum(USER_TYPE).optional(),
    registrationStatus: z.nativeEnum(REGISTRATION_STATUS).optional(),
    paymentStatus: z.nativeEnum(PAYMENT_STATUS).optional(),
    registrationCode: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

// Cancel registration
const cancelRegistrationZodSchema = z.object({
  body: z.object({
    reason: z.string().max(500, 'Reason is too long').optional()
  })
});

// Resend confirmation email
const resendEmailZodSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid registration ID')
  })
});

export const EventRegistrationValidations = {
  createRegisteredUserRegistrationZodSchema,
  createPublicUserRegistrationZodSchema,
  updateRegistrationZodSchema,
  verifyRegistrationZodSchema,
  paymentSuccessZodSchema,
  paymentFailZodSchema,
  getRegistrationsZodSchema,
  cancelRegistrationZodSchema,
  resendEmailZodSchema
};