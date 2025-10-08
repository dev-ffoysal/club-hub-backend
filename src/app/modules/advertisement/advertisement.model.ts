import { Schema, model } from 'mongoose';
import { IAdvertisement, AdvertisementModel, ADVERTISEMENT_TYPE, ADVERTISEMENT_STATUS } from './advertisement.interface';

const advertisementSchema = new Schema<IAdvertisement, AdvertisementModel>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(ADVERTISEMENT_TYPE),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ADVERTISEMENT_STATUS),
    default: ADVERTISEMENT_STATUS.DRAFT
  },
  
  // Campaign dates
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Media assets
  image: {
    type: String
  },
  banner: {
    type: String
  },
  video: {
    type: String
  },
  
  // Links and actions
  externalLink: {
    type: String
  },
  callToAction: {
    type: String
  },
  
  // Club-related fields
  club: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  
  // External advertiser info
  advertiserName: {
    type: String
  },
  advertiserEmail: {
    type: String
  },
  advertiserPhone: {
    type: String
  },
  advertiserWebsite: {
    type: String
  },
  
  // Targeting and visibility
  targetAudience: {
    type: [String]
  },
  universities: [{
    type: Schema.Types.ObjectId,
    ref: 'University'
  }],
  departments: {
    type: [String]
  },
  
  // Performance tracking
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  budget: {
    type: Number
  },
  costPerClick: {
    type: Number
  },
  
  // Priority and positioning
  priority: {
    type: Number,
    default: 1
  },
  position: {
    type: String,
    enum: ['banner', 'sidebar', 'feed', 'popup'],
    default: 'feed'
  },
  
  // Approval and management
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  
  // Additional metadata
  tags: {
    type: [String]
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
advertisementSchema.index({ status: 1, startDate: 1, endDate: 1 });
advertisementSchema.index({ type: 1, status: 1 });
advertisementSchema.index({ club: 1, status: 1 });
advertisementSchema.index({ priority: -1, createdAt: -1 });
advertisementSchema.index({ universities: 1, status: 1 });

// Pre-save middleware to validate dates
advertisementSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    const error = new Error('End date must be after start date');
    return next(error);
  }
  
  // Auto-expire ads that have passed their end date
  if (this.endDate < new Date() && this.status === ADVERTISEMENT_STATUS.ACTIVE) {
    this.status = ADVERTISEMENT_STATUS.EXPIRED;
  }
  
  next();
});

// Static method to get active advertisements
advertisementSchema.statics.getActiveAds = function(filters = {}) {
  const now = new Date();
  return this.find({
    status: ADVERTISEMENT_STATUS.ACTIVE,
    startDate: { $lte: now },
    endDate: { $gte: now },
    ...filters
  }).sort({ priority: -1, createdAt: -1 });
};

// Instance method to increment impressions
advertisementSchema.methods.incrementImpressions = function() {
  this.impressions += 1;
  return this.save();
};

// Instance method to increment clicks
advertisementSchema.methods.incrementClicks = function() {
  this.clicks += 1;
  return this.save();
};

export const Advertisement = model<IAdvertisement, AdvertisementModel>('Advertisement', advertisementSchema);