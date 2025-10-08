import { z } from 'zod';
import { ADVERTISEMENT_TYPE, ADVERTISEMENT_STATUS } from './advertisement.interface';

const createAdvertisementZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required'
    }).min(1, 'Title cannot be empty').max(200, 'Title cannot exceed 200 characters'),
    
    description: z.string({
      required_error: 'Description is required'
    }).min(1, 'Description cannot be empty'),
    
    type: z.enum(Object.values(ADVERTISEMENT_TYPE) as [string, ...string[]], {
      required_error: 'Advertisement type is required'
    }),
    
    status: z.enum(Object.values(ADVERTISEMENT_STATUS) as [string, ...string[]]).optional(),
    
    startDate: z.string({
      required_error: 'Start date is required'
    }).datetime('Invalid start date format'),
    
    endDate: z.string({
      required_error: 'End date is required'
    }).datetime('Invalid end date format'),
    
    // Media assets
    image: z.string().url('Invalid image URL').optional(),
    banner: z.string().url('Invalid banner URL').optional(),
    video: z.string().url('Invalid video URL').optional(),
    
    // Links and actions
    externalLink: z.string().url('Invalid external link URL').optional(),
    callToAction: z.string().max(100, 'Call to action cannot exceed 100 characters').optional(),
    
    // Club-related fields
    club: z.string().optional(),
    event: z.string().optional(),
    
    // External advertiser info
    advertiserName: z.string().max(100, 'Advertiser name cannot exceed 100 characters').optional(),
    advertiserEmail: z.string().email('Invalid advertiser email').optional(),
    advertiserPhone: z.string().max(20, 'Phone number cannot exceed 20 characters').optional(),
    advertiserWebsite: z.string().url('Invalid advertiser website URL').optional(),
    
    // Targeting and visibility
    targetAudience: z.array(z.string()).optional(),
    universities: z.array(z.string()).optional(),
    departments: z.array(z.string()).optional(),
    
    // Performance tracking
    budget: z.number().positive('Budget must be positive').optional(),
    costPerClick: z.number().positive('Cost per click must be positive').optional(),
    
    // Priority and positioning
    priority: z.number().int().min(1).max(100).optional(),
    position: z.enum(['banner', 'sidebar', 'feed', 'popup']).optional(),
    
    // Additional metadata
    tags: z.array(z.string()).optional(),
    notes: z.string().optional()
  })
}).refine((data) => {
  const startDate = new Date(data.body.startDate);
  const endDate = new Date(data.body.endDate);
  return startDate < endDate;
}, {
  message: 'End date must be after start date',
  path: ['body', 'endDate']
});

const updateAdvertisementZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').max(200, 'Title cannot exceed 200 characters').optional(),
    description: z.string().min(1, 'Description cannot be empty').optional(),
    type: z.enum(Object.values(ADVERTISEMENT_TYPE) as [string, ...string[]]).optional(),
    status: z.enum(Object.values(ADVERTISEMENT_STATUS) as [string, ...string[]]).optional(),
    
    startDate: z.string().datetime('Invalid start date format').optional(),
    endDate: z.string().datetime('Invalid end date format').optional(),
    
    // Media assets
    image: z.string().url('Invalid image URL').optional(),
    banner: z.string().url('Invalid banner URL').optional(),
    video: z.string().url('Invalid video URL').optional(),
    
    // Links and actions
    externalLink: z.string().url('Invalid external link URL').optional(),
    callToAction: z.string().max(100, 'Call to action cannot exceed 100 characters').optional(),
    
    // Club-related fields
    club: z.string().optional(),
    event: z.string().optional(),
    
    // External advertiser info
    advertiserName: z.string().max(100, 'Advertiser name cannot exceed 100 characters').optional(),
    advertiserEmail: z.string().email('Invalid advertiser email').optional(),
    advertiserPhone: z.string().max(20, 'Phone number cannot exceed 20 characters').optional(),
    advertiserWebsite: z.string().url('Invalid advertiser website URL').optional(),
    
    // Targeting and visibility
    targetAudience: z.array(z.string()).optional(),
    universities: z.array(z.string()).optional(),
    departments: z.array(z.string()).optional(),
    
    // Performance tracking
    budget: z.number().positive('Budget must be positive').optional(),
    costPerClick: z.number().positive('Cost per click must be positive').optional(),
    
    // Priority and positioning
    priority: z.number().int().min(1).max(100).optional(),
    position: z.enum(['banner', 'sidebar', 'feed', 'popup']).optional(),
    
    // Additional metadata
    tags: z.array(z.string()).optional(),
    notes: z.string().optional()
  })
}).refine((data) => {
  if (data.body.startDate && data.body.endDate) {
    const startDate = new Date(data.body.startDate);
    const endDate = new Date(data.body.endDate);
    return startDate < endDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['body', 'endDate']
});

// Validation for tracking impression/click endpoints
const trackImpressionZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Advertisement ID is required'
    })
  })
});

const trackClickZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Advertisement ID is required'
    })
  })
});

// Validation for getting advertisements by position
const getAdsByPositionZodSchema = z.object({
  params: z.object({
    position: z.enum(['banner', 'sidebar', 'feed', 'popup'], {
      required_error: 'Position is required'
    })
  })
});

export const AdvertisementValidations = {
  create: createAdvertisementZodSchema,
  update: updateAdvertisementZodSchema,
  trackImpression: trackImpressionZodSchema,
  trackClick: trackClickZodSchema,
  getAdsByPosition: getAdsByPositionZodSchema
};