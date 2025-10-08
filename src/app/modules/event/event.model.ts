import { Schema, model } from 'mongoose';
import { IEvent, EventModel } from './event.interface';
import { EVENT_TYPE } from '../../../enum/event';

const eventSchema = new Schema<IEvent, EventModel>({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    populate: {
      path: 'createdBy',
      select: 'name email profile cover clubName'
    }
  },
  categories: {
    type: [Schema.Types.ObjectId],
    ref: 'Category',
    required: true,
    populate: {
      path: 'categories',
      select: 'title'
    }
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slogan: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true

  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  time: {
    type: String,
  },
  images: [{
    type: String,
    required: true

  }],
  cover: {
    type: String,
  },
  location: {
    type: String,
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  isFixedSeat: {
    type: Boolean,
    default: false
  },
  registrationFee: {
    type: Number,
    min: 0,
    default: 0
  },

  meetingLink: {
    type: String
  },
  maxParticipants: {
    type: Number,
    min: 0
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationDeadline: {
    type: Date
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  commentsEnabled: {
    type: Boolean,
    default: true
  },
  followersCount: {
    type: Number,
    default: 0,
    min: 0
  },
  upVotesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  downVotesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    enum: Object.values(EVENT_TYPE),
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  organizedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    populate: {
      path: 'createdBy',
      select: 'name email profile cover clubName'
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  host: [{
    name: {
      type: String,
    },
    designation: {
      type: String,

    },
    position: {
      type: String,

    },
    image: {
      type: String
    }
  }],
  winningPrize: [{
    title: {
      type: String,
    },
    description: {
      type: String,

    },
    amount: {
      type: Number,
      min: 0
    },
    position: {
      type: Number,
      min: 1
    }
  }],
  guests: [{
    name: {
      type: String,
      required: true,

    },
    designation: {
      type: String,

    },
    position: {
      type: String,

    },
    image: {
      type: String
    }
  }],
  benefits: [{
    title: {
      type: String,
    },
    description: {
      type: String,
    }
  }],
  requirements: [{
    title: {
      type: String,
      required: true,

    },
    description: {
      type: String,
    },
    criteria: [{
      type: String,

    }]
  }],
  rules: [{
    title: {
      type: String,
      required: true,

    },
    description: {
      type: String,
      required: true,

    },
    criteria: [{
      type: String,
    }]
  }],
  eligibility: [{
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    criteria: [{
      type: String,
    }]
  }],
  instructions: [{
    title: {
      type: String,

    },
    description: {
      type: String,
    },
    criteria: [{
      type: String,
    }]
  }],
  sponsors:[{
    
    title:{
      type:String,
    },
    image:{
      type:String

    },
    website:{
      type:String,
      url:true
    },
    sponsorType:{
      type:String,
      required: true,
    }
  }],
  
  faqs: [{
    question: {
      type: String,

    },
    answer: {
      type: String,

    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
eventSchema.index({ createdBy: 1 });
eventSchema.index({ organizedBy: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ title: 'text', description: 'text' });

// Validation middleware
eventSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  if (this.registrationDeadline && this.registrationDeadline >= this.startDate) {
    next(new Error('Registration deadline must be before start date'));
  }
  if (this.maxParticipants && this.maxParticipants < this.currentParticipants) {
    next(new Error('Max participants cannot be less than current participants'));
  }
  next();
});

export const Event = model<IEvent, EventModel>('Event', eventSchema);
