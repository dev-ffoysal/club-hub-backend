import { z } from 'zod';
import { EVENT_TYPE } from '../../../enum/event';

const hostSchema = z.object({
  name: z.string().min(1, 'Host name is required'),
  designation: z.string().optional(),
  position: z.string().optional(),
  image: z.string().optional()
});

const winningPrizeSchema = z.object({
  title: z.string().min(1, 'Prize title is required'),
  description: z.string().optional(),
  amount: z.number().min(0, 'Prize amount must be non-negative').optional(),
  position: z.number().min(1, 'Position must be at least 1').optional()
});

const guestSchema = z.object({
  name: z.string().min(1, 'Guest name is required'),
  designation: z.string().optional(),
  position: z.string().optional(),
  image: z.string().optional()
});

const benefitSchema = z.object({
  title: z.string().min(1, 'Benefit title is required'),
  description: z.string().optional()
});

const detailSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  criteria: z.array(z.string()).optional()
});

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required')
});

const createEventZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    categories: z.array(z.string()).min(1, 'Category is required'),
    slogan: z.string().optional(),
    description: z.string().optional(),
    collaboratedWith: z.array(z.string()).optional(),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date format'
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date format'
    }),
    time: z.string().optional(),

    images: z.array(z.string({
      required_error: 'Images are required',
      invalid_type_error: 'Images must be an array of strings'
    })).min(1, 'At least one image is required'),
    covers: z.array(z.string({
      required_error: 'Covers are required',
      invalid_type_error: 'Covers must be an array of strings'
    })).min(1, 'At least one cover image is required'),
    location: z.string().min(1, 'Location is required'),
    isOnline: z.boolean().default(false),
    isFixedSeat: z.boolean().default(false),
    registrationFee: z.number().min(0, 'Registration fee must be non-negative').optional(),
    seatCount: z.number().min(0, 'Seat count must be non-negative').optional(),
    meetingLink: z.string().optional(),
    maxParticipants: z.number().min(0, 'Max participants must be non-negative').optional(),
    registrationDeadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid registration deadline format'
    }).optional(),
    isPublic: z.boolean().default(true),
    commentsEnabled: z.boolean().default(true),
    type: z.nativeEnum(EVENT_TYPE, {
      errorMap: () => ({ message: 'Invalid event type' })
    }),
    tags: z.array(z.string()).default([]),
    organizedBy: z.string().optional(),
    host: z.array(hostSchema).optional(),
    winningPrize: z.array(winningPrizeSchema).optional(),
    guests: z.array(guestSchema).optional(),
    benefits: z.array(benefitSchema).optional(),
    requirements: z.array(detailSchema).optional(),
    rules: z.array(detailSchema).optional(),
    eligibility: z.array(detailSchema).optional(),
    instructions: z.array(detailSchema).optional(),
    faqs: z.array(faqSchema).optional()
  }).refine((data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate > startDate;
  }, {
    message: 'End date must be after start date',
    path: ['endDate']
  }).refine((data) => {
    if (data.registrationDeadline) {
      const startDate = new Date(data.startDate);
      const regDeadline = new Date(data.registrationDeadline);
      return regDeadline < startDate;
    }
    return true;
  }, {
    message: 'Registration deadline must be before start date',
    path: ['registrationDeadline']
  })
});

const updateEventZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    category: z.string().min(1, 'Category is required').optional(),
    slogan: z.string().optional(),
    description: z.string().optional(),
    collaboratedWith: z.array(z.string()).optional(),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date format'
    }).optional(),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date format'
    }).optional(),
    covers: z.array(z.string()).optional(),
    time: z.string().optional(),
    images: z.array(z.string()).optional(),
    location: z.string().min(1, 'Location is required').optional(),
    isOnline: z.boolean().optional(),
    isFixedSeat: z.boolean().optional(),
    registrationFee: z.number().min(0, 'Registration fee must be non-negative').optional(),
    seatCount: z.number().min(0, 'Seat count must be non-negative').optional(),
    bookedSeatCount: z.number().min(0, 'Booked seat count must be non-negative').optional(),
    meetingLink: z.string().url('Invalid meeting link URL').optional(),
    maxParticipants: z.number().min(0, 'Max participants must be non-negative').optional(),
    currentParticipants: z.number().min(0, 'Current participants must be non-negative').optional(),
    registrationDeadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid registration deadline format'
    }).optional(),
    isPublic: z.boolean().optional(),
    commentsEnabled: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    host: hostSchema.optional(),
    organizedBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid organizer ID').optional(),
    winningPrize: z.array(winningPrizeSchema).optional(),
    guests: z.array(guestSchema).optional(),
    benefits: z.array(benefitSchema).optional(),
    requirements: z.array(detailSchema).optional(),
    rules: z.array(detailSchema).optional(),
    eligibility: z.array(detailSchema).optional(),
    instructions: z.array(detailSchema).optional(),
    faqs: z.array(faqSchema).optional()
  })
});

export const EventValidations = {
  createEventZodSchema,
  updateEventZodSchema
};
