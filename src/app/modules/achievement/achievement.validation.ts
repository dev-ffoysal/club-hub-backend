import { Types } from 'mongoose';
import { z } from 'zod';

export const AchievementValidations = {
  create: z.object({
    body: z.object({
      images: z.array(z.string(), {
        required_error: 'Images are required'
      }).min(1, 'At least one image is required'),
      title: z.string({
        required_error: 'Title is required'
      }),
      description: z.string({
        required_error: 'Description is required'
      }),
      subTitle: z.string({
        required_error: 'Subtitle is required'
      }),
      date: z.string({
        required_error: 'Date is required'
      }),
      subDescription: z.string({
        required_error: 'Subdescription is required'
      }),
      tags: z.array(z.string(), {
        required_error: 'Tags are required'
      }).min(1, 'At least one tag is required'),
      event: z.string().optional(),
      organizedBy: z.object({
        name: z.string({
          required_error: 'Name is required'
        }),
        title: z.string({
          required_error: 'Title is required'
        }),
        description: z.string({
          required_error: 'Description is required'
        }),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
      })
    })
  }),

  update: z.object({
  body: z.object({
    images: z.array(z.string()).min(0).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    subTitle: z.string().optional(),
    date: z.string().optional(),
    isPublic: z.boolean().optional(),
    subDescription: z.string().optional(),
    tags: z.array(z.string()).min(0).optional(),
    event: z.string().optional(),
    organizedBy: z
      .object({
        name: z.string().optional(),
        image: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
    params: z.object({
      id: z.string({
        required_error: 'ID is required'
      })
    })
  }),
  getSingleAchievement: z.object({
    params: z.object({
      id: z.string({
        required_error: 'ID is required'
      }).refine((id) => Types.ObjectId.isValid(id), {
        message: 'Invalid ID format'
      }),
    })
  }),
  getClubAchievements: z.object({
    params: z.object({
      id: z.string({
        required_error: 'ID is required'
      }).refine((id) => Types.ObjectId.isValid(id), {
        message: 'Invalid ID format'
      }),
    })
  }),

  
};
