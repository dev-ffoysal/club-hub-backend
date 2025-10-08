import { z } from 'zod';
import { EVENT_TYPE } from '../../../enum/event';

// Reusable schemas
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

const sponsorSchema = z.object({
  name: z.string().min(1, 'Sponsor name is required'),
  image: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  sponsorType: z.string().optional()
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

// Step 1: Basic Information & Media
export const step1ValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slogan: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    categories: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')).min(1, 'At least one category is required'),
    type: z.nativeEnum(EVENT_TYPE, {
      errorMap: () => ({ message: 'Invalid event type' })
    }),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    cover: z.string().min(1, 'Cover image is required'),
    tags: z.array(z.string()).default([])
  })
});

// Step 2: Event Details & Settings
export const step2ValidationSchema = z.object({
  body: z.object({
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date format'
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date format'
    }),
    time: z.string().min(1, 'Time is required'),
    location: z.string().min(1, 'Location is required'),
    isOnline: z.boolean().default(false),
    meetingLink: z.string().url('Invalid meeting link URL').optional(),
    isFixedSeat: z.boolean().default(false),
    maxParticipants: z.number().min(1, 'Max participants must be at least 1').optional(),
    registrationFee: z.number().min(0, 'Registration fee must be non-negative').default(0),
    registrationDeadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid registration deadline format'
    }).optional(),
    isPublic: z.boolean().default(true),
    commentsEnabled: z.boolean().default(true),
    organizedBy: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid organizer ID'),
    collaboratedWith: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid collaborator ID')).optional()
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
  }).refine((data) => {
    if (data.isOnline && !data.meetingLink) {
      return false;
    }
    return true;
  }, {
    message: 'Meeting link is required for online events',
    path: ['meetingLink']
  })
});

// Step 3: People & Prizes
export const step3ValidationSchema = z.object({
  body: z.object({
    host: z.array(hostSchema).optional(),
    guests: z.array(guestSchema).optional(),
    winningPrize: z.array(winningPrizeSchema).optional(),
    sponsors: z.array(sponsorSchema).optional()
  })
});

// Step 4: Additional Information & Completion
export const step4ValidationSchema = z.object({
  body: z.object({
    benefits: z.array(detailSchema).optional(),
    requirements: z.array(detailSchema).optional(),
    rules: z.array(detailSchema).optional(),
    eligibility: z.array(detailSchema).optional(),
    instructions: z.array(detailSchema).optional(),
    faqs: z.array(faqSchema).optional(),
    markAsComplete: z.boolean().default(false)
  })
});

// Update step validation (for any step)
export const updateStepValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    slogan: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    categories: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')).optional(),
    type: z.nativeEnum(EVENT_TYPE).optional(),
    images: z.array(z.string()).optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional(),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date format'
    }).optional(),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date format'
    }).optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    isOnline: z.boolean().optional(),
    meetingLink: z.string().url('Invalid meeting link URL').optional(),
    isFixedSeat: z.boolean().optional(),
    maxParticipants: z.number().min(1, 'Max participants must be at least 1').optional(),
    registrationFee: z.number().min(0, 'Registration fee must be non-negative').optional(),
    registrationDeadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid registration deadline format'
    }).optional(),
    isPublic: z.boolean().optional(),
    commentsEnabled: z.boolean().optional(),
    organizedBy: z.string().optional(),
    host: z.array(hostSchema).optional(),
    guests: z.array(guestSchema).optional(),
    winningPrize: z.array(winningPrizeSchema).optional(),
    sponsors: z.array(sponsorSchema).optional(),
    benefits: z.array(detailSchema).optional(),
    requirements: z.array(detailSchema).optional(),
    rules: z.array(detailSchema).optional(),
    eligibility: z.array(detailSchema).optional(),
    instructions: z.array(detailSchema).optional(),
    faqs: z.array(faqSchema).optional(),
    markAsComplete: z.boolean().optional(),

  })
});

export const EventMultiStepValidations = {
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema,
  step4ValidationSchema,
  updateStepValidationSchema
};

export {
  hostSchema,
  winningPrizeSchema,
  guestSchema,
  sponsorSchema,
  detailSchema,
  faqSchema
};