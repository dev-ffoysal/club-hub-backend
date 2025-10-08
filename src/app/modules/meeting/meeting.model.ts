import { Schema, model } from 'mongoose';
import { IMeeting, MeetingModel, MEETING_STATUS, PARTICIPANT_STATUS, PARTICIPANT_ROLE, IParticipant, IMediaSettings } from './meeting.interface';
import { generateUniqueCode } from '../../../utils/codeGenerator';

// Media settings schema
const mediaSettingsSchema = new Schema<IMediaSettings>({
  video: {
    type: Boolean,
    default: false
  },
  audio: {
    type: Boolean,
    default: false
  },
  screenShare: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Participant schema
const participantSchema = new Schema<IParticipant>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  guestName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(PARTICIPANT_ROLE),
    default: PARTICIPANT_ROLE.PARTICIPANT
  },
  status: {
    type: String,
    enum: Object.values(PARTICIPANT_STATUS),
    default: PARTICIPANT_STATUS.INVITED
  },
  mediaSettings: {
    type: mediaSettingsSchema,
    default: () => ({ video: false, audio: false, screenShare: false })
  },
  joinedAt: {
    type: Date
  },
  leftAt: {
    type: Date
  },
  socketId: {
    type: String
  },
  peerId: {
    type: String
  }
}, { timestamps: true });

// Meeting schema
const meetingSchema = new Schema<IMeeting>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [participantSchema],
  status: {
    type: String,
    enum: Object.values(MEETING_STATUS),
    default: MEETING_STATUS.SCHEDULED
  },
  scheduledAt: {
    type: Date
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  duration: {
    type: Number,
    min: 0
  },
  maxParticipants: {
    type: Number,
    default: 50,
    min: 2,
    max: 500
  },
  isRecording: {
    type: Boolean,
    default: false
  },
  recordingUrl: {
    type: String
  },
  meetingCode: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  allowGuests: {
    type: Boolean,
    default: true
  },
  waitingRoom: {
    type: Boolean,
    default: false
  },
  chatEnabled: {
    type: Boolean,
    default: true
  },
  screenShareEnabled: {
    type: Boolean,
    default: true
  },
  settings: {
    muteOnJoin: {
      type: Boolean,
      default: true
    },
    videoOnJoin: {
      type: Boolean,
      default: false
    },
    allowParticipantScreenShare: {
      type: Boolean,
      default: true
    },
    allowParticipantChat: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes
meetingSchema.index({ host: 1 });
meetingSchema.index({ meetingCode: 1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ scheduledAt: 1 });
meetingSchema.index({ startedAt: 1 });
meetingSchema.index({ createdAt: -1 });
meetingSchema.index({ 'participants.user': 1 });
meetingSchema.index({ 'participants.status': 1 });

// Pre-save middleware to generate meeting code
meetingSchema.pre('save', async function(next) {
  if (!this.meetingCode) {
    this.meetingCode = await generateUniqueCode();
  }
  next();
});

// Instance methods
meetingSchema.methods.addParticipant = function(participant: Partial<IParticipant>) {
  // Check if participant already exists
  const existingParticipant = this.participants.find((p: IParticipant) => 
    (participant.user && p.user?.toString() === participant.user.toString()) ||
    (participant.guestName && p.guestName === participant.guestName)
  );
  
  if (existingParticipant) {
    // Update existing participant
    Object.assign(existingParticipant, participant);
  } else {
    // Add new participant
    this.participants.push(participant as IParticipant);
  }
  
  return this.save();
};

meetingSchema.methods.removeParticipant = function(participantId: string) {
  this.participants = this.participants.filter((p: IParticipant) => 
    p._id.toString() !== participantId
  );
  return this.save();
};

meetingSchema.methods.updateParticipantMedia = function(participantId: string, mediaSettings: Partial<IMediaSettings>) {
  const participant = this.participants.find((p: IParticipant) => 
    p._id.toString() === participantId
  );
  
  if (participant) {
    Object.assign(participant.mediaSettings, mediaSettings);
  }
  
  return this.save();
};

meetingSchema.methods.startMeeting = function() {
  this.status = MEETING_STATUS.ACTIVE;
  this.startedAt = new Date();
  return this.save();
};

meetingSchema.methods.endMeeting = function() {
  this.status = MEETING_STATUS.ENDED;
  this.endedAt = new Date();
  
  // Calculate duration if started
  if (this.startedAt) {
    this.duration = Math.round((this.endedAt.getTime() - this.startedAt.getTime()) / (1000 * 60));
  }
  
  // Update all active participants to left
  this.participants.forEach((participant: IParticipant) => {
    if (participant.status === PARTICIPANT_STATUS.JOINED) {
      participant.status = PARTICIPANT_STATUS.LEFT;
      participant.leftAt = new Date();
    }
  });
  
  return this.save();
};

// Static methods
meetingSchema.statics.findByMeetingCode = function(code: string) {
  return this.findOne({ meetingCode: code }).populate('participants.user');
};

meetingSchema.statics.findByHost = function(hostId: string) {
  return this.find({ host: hostId }).sort({ createdAt: -1 });
};

meetingSchema.statics.findActiveMeetings = function() {
  return this.find({ status: MEETING_STATUS.ACTIVE });
};

meetingSchema.statics.findScheduledMeetings = function() {
  return this.find({ 
    status: MEETING_STATUS.SCHEDULED,
    scheduledAt: { $gte: new Date() }
  }).sort({ scheduledAt: 1 });
};

export const Meeting = model<IMeeting>('Meeting', meetingSchema) as MeetingModel;