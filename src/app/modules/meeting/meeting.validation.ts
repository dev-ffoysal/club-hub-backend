import { z } from 'zod';
import { MEETING_STATUS, PARTICIPANT_ROLE } from './meeting.interface';

const createMeetingZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required'
    }).min(1, 'Title cannot be empty').max(200, 'Title cannot exceed 200 characters'),
    
    description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
    
    scheduledAt: z.string().datetime().optional(),
    
    maxParticipants: z.number()
      .min(2, 'Minimum 2 participants required')
      .max(500, 'Maximum 500 participants allowed')
      .optional(),
    
    password: z.string().min(4, 'Password must be at least 4 characters').optional(),
    
    isPublic: z.boolean().optional(),
    
    allowGuests: z.boolean().optional(),
    
    waitingRoom: z.boolean().optional(),
    
    chatEnabled: z.boolean().optional(),
    
    screenShareEnabled: z.boolean().optional(),
    
    settings: z.object({
      muteOnJoin: z.boolean().optional(),
      videoOnJoin: z.boolean().optional(),
      allowParticipantScreenShare: z.boolean().optional(),
      allowParticipantChat: z.boolean().optional()
    }).optional()
  })
});

const updateMeetingZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').max(200, 'Title cannot exceed 200 characters').optional(),
    
    description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
    
    scheduledAt: z.string().datetime().optional(),
    
    maxParticipants: z.number()
      .min(2, 'Minimum 2 participants required')
      .max(500, 'Maximum 500 participants allowed')
      .optional(),
    
    password: z.string().min(4, 'Password must be at least 4 characters').optional(),
    
    isPublic: z.boolean().optional(),
    
    allowGuests: z.boolean().optional(),
    
    waitingRoom: z.boolean().optional(),
    
    chatEnabled: z.boolean().optional(),
    
    screenShareEnabled: z.boolean().optional(),
    
    settings: z.object({
      muteOnJoin: z.boolean().optional(),
      videoOnJoin: z.boolean().optional(),
      allowParticipantScreenShare: z.boolean().optional(),
      allowParticipantChat: z.boolean().optional()
    }).optional()
  })
});

const joinMeetingZodSchema = z.object({
  body: z.object({
    meetingCode: z.string({
      required_error: 'Meeting code is required'
    }).min(1, 'Meeting code cannot be empty'),
    
    guestName: z.string().min(1, 'Guest name is required').optional(),
    
    password: z.string().optional()
  })
});

const getMeetingByCodeZodSchema = z.object({
  params: z.object({
    code: z.string({
      required_error: 'Meeting code is required'
    })
  })
});

const getMeetingZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Meeting ID is required'
    })
  })
});

const getMeetingsZodSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    host: z.string().optional(),
    status: z.enum(Object.values(MEETING_STATUS) as [string, ...string[]]).optional(),
    isPublic: z.string().transform(val => val === 'true').optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().transform(val => parseInt(val)).optional(),
    limit: z.string().transform(val => parseInt(val)).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
});

const updateParticipantMediaZodSchema = z.object({
  body: z.object({
    video: z.boolean().optional(),
    audio: z.boolean().optional(),
    screenShare: z.boolean().optional()
  }),
  params: z.object({
    meetingId: z.string({
      required_error: 'Meeting ID is required'
    }),
    participantId: z.string({
      required_error: 'Participant ID is required'
    })
  })
});

const kickParticipantZodSchema = z.object({
  params: z.object({
    meetingId: z.string({
      required_error: 'Meeting ID is required'
    }),
    participantId: z.string({
      required_error: 'Participant ID is required'
    })
  })
});

const startMeetingZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Meeting ID is required'
    })
  })
});

const endMeetingZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Meeting ID is required'
    })
  })
});

// WebRTC signaling validation
const signalingMessageZodSchema = z.object({
  type: z.enum(['offer', 'answer', 'ice-candidate', 'join-room', 'leave-room']),
  payload: z.any(),
  from: z.string().optional(),
  to: z.string().optional(),
  roomId: z.string({
    required_error: 'Room ID is required'
  })
});

const joinRoomZodSchema = z.object({
  roomId: z.string({
    required_error: 'Room ID is required'
  }),
  userId: z.string().optional(),
  guestName: z.string().optional(),
  peerId: z.string({
    required_error: 'Peer ID is required'
  }),
  mediaSettings: z.object({
    video: z.boolean().default(false),
    audio: z.boolean().default(false),
    screenShare: z.boolean().default(false)
  }).optional()
});

const mediaToggleZodSchema = z.object({
  roomId: z.string({
    required_error: 'Room ID is required'
  }),
  mediaType: z.enum(['video', 'audio', 'screenShare']),
  enabled: z.boolean()
});

export const MeetingValidation = {
  createMeetingZodSchema,
  updateMeetingZodSchema,
  joinMeetingZodSchema,
  getMeetingByCodeZodSchema,
  getMeetingZodSchema,
  getMeetingsZodSchema,
  updateParticipantMediaZodSchema,
  kickParticipantZodSchema,
  startMeetingZodSchema,
  endMeetingZodSchema,
  signalingMessageZodSchema,
  joinRoomZodSchema,
  mediaToggleZodSchema
};