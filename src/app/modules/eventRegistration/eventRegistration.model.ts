import { Schema, model } from 'mongoose';
import { IEventRegistration, EventRegistrationModel, REGISTRATION_STATUS, PAYMENT_STATUS, PAYMENT_METHOD, USER_TYPE, PARTICIPATION_STATUS } from './eventRegistration.interface';
import { generateUniqueCode } from '../../../utils/codeGenerator';


const publicUserInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    trim: true
  }
}, { _id: false });

export const paymentInfoSchema = new Schema({
  method: {
    type: String,
    enum: Object.values(PAYMENT_METHOD),
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'BDT'
  },
  gatewayResponse: {
    type: Schema.Types.Mixed
  },
  processedAt: {
    type: Date
  }
}, { _id: false });

const eventRegistrationSchema = new Schema<IEventRegistration>({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  publicUserInfo: {
    type: publicUserInfoSchema
  },
  userType: {
    type: String,
    enum: Object.values(USER_TYPE),
    required: true
  },
  registrationCode: {
    type: String,
    required: true
  },
  registrationStatus: {
    type: String,
    enum: Object.values(REGISTRATION_STATUS),
    default: REGISTRATION_STATUS.PENDING
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  paymentInfo: {
    type: paymentInfoSchema
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  participationStatus: {
    type: String,
    enum: Object.values(PARTICIPATION_STATUS),
    default: PARTICIPATION_STATUS.NOT_PARTICIPATED
  },
  participatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
eventRegistrationSchema.index({ event: 1 });
eventRegistrationSchema.index({ user: 1 });
eventRegistrationSchema.index({ registrationCode: 1 });
eventRegistrationSchema.index({ registrationStatus: 1 });
eventRegistrationSchema.index({ paymentStatus: 1 });
eventRegistrationSchema.index({ userType: 1 });
eventRegistrationSchema.index({ 'publicUserInfo.email': 1 });
eventRegistrationSchema.index({ createdAt: -1 });

// Compound indexes
eventRegistrationSchema.index({ event: 1, registrationStatus: 1 });
eventRegistrationSchema.index({ event: 1, paymentStatus: 1 });
eventRegistrationSchema.index({ event: 1, participationStatus: 1 });
eventRegistrationSchema.index({ participationStatus: 1 });
eventRegistrationSchema.index({ participatedAt: -1 });

// Validation middleware
eventRegistrationSchema.pre('save', function(next) {
  // Ensure either user or publicUserInfo is provided based on userType
  if (this.userType === USER_TYPE.REGISTERED && !this.user) {
    next(new Error('User ID is required for registered user type'));
  }
  if (this.userType === USER_TYPE.PUBLIC && !this.publicUserInfo) {
    next(new Error('Public user info is required for public user type'));
  }
  
  // Generate unique registration code if not provided
  if (!this.registrationCode) {
    this.registrationCode = generateUniqueCode();
  }
  
  next();
});

// Static methods
eventRegistrationSchema.statics.findByRegistrationCode = function(code: string) {
  return this.findOne({ registrationCode: code }).populate('event').populate('user');
};

eventRegistrationSchema.statics.findByEvent = function(eventId: string) {
  return this.find({ event: eventId }).populate('user');
};

eventRegistrationSchema.statics.countByEventAndStatus = function(eventId: string, status: REGISTRATION_STATUS) {
  return this.countDocuments({ event: eventId, registrationStatus: status });
};

eventRegistrationSchema.statics.markBulkParticipation = function(registrationIds: string[], participated: boolean) {
  const updateData: any = {
    participationStatus: participated ? PARTICIPATION_STATUS.PARTICIPATED : PARTICIPATION_STATUS.NOT_PARTICIPATED
  };
  
  if (participated) {
    updateData.participatedAt = new Date();
  } else {
    updateData.$unset = { participatedAt: 1 };
  }
  
  return this.updateMany(
    { _id: { $in: registrationIds } },
    updateData
  );
};

eventRegistrationSchema.statics.getParticipationStats = function(eventId: string) {
  return this.aggregate([
    { $match: { event: eventId } },
    {
      $group: {
        _id: '$participationStatus',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance methods
eventRegistrationSchema.methods.markAsPaid = function(paymentInfo: any) {
  this.paymentStatus = PAYMENT_STATUS.COMPLETED;
  this.registrationStatus = REGISTRATION_STATUS.PAID;
  this.paymentInfo = paymentInfo;
  this.confirmedAt = new Date();
  return this.save();
};

eventRegistrationSchema.methods.markAsConfirmed = function() {
  this.registrationStatus = REGISTRATION_STATUS.CONFIRMED;
  if (!this.confirmedAt) {
    this.confirmedAt = new Date();
  }
  return this.save();
};

eventRegistrationSchema.methods.cancel = function(reason?: string) {
  this.registrationStatus = REGISTRATION_STATUS.CANCELLED;
  this.cancelledAt = new Date();
  if (reason) {
    this.notes = reason;
  }
  return this.save();
};

eventRegistrationSchema.methods.markParticipation = function(participated: boolean) {
  this.participationStatus = participated ? PARTICIPATION_STATUS.PARTICIPATED : PARTICIPATION_STATUS.NOT_PARTICIPATED;
  if (participated) {
    this.participatedAt = new Date();
  } else {
    this.participatedAt = undefined;
  }
  return this.save();
};

export const EventRegistration = model<IEventRegistration>('EventRegistration', eventRegistrationSchema) as EventRegistrationModel;