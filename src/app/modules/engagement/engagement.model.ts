import { Schema, model } from 'mongoose';
import { IEngagement, EngagementModel, VoteType } from './engagement.interface'; 

const engagementSchema = new Schema<IEngagement, EngagementModel>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  event: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event',
    required: true,
    index: true
  },
  voteType: { 
    type: String, 
    enum: ['upvote', 'downvote'],
    default: null
  },
}, {
  timestamps: true
});

// Compound index for efficient queries
engagementSchema.index({ user: 1, event: 1 }, { unique: true });
engagementSchema.index({ event: 1, voteType: 1 });
engagementSchema.index({ user: 1, voteType: 1 });

// Pre-save validation
engagementSchema.pre('save', function(next) {
  // Ensure user and event are valid ObjectIds
  if (!this.user || !this.event) {
    return next(new Error('User and Event are required'));
  }
  next();
});

export const Engagement = model<IEngagement, EngagementModel>('Engagement', engagementSchema);
