import { Schema, model } from 'mongoose';
import { IClubregistration, ClubregistrationModel } from './clubregistration.interface'; 
import { CLUB_REGISTRATION_STATUS } from './clubregistration.constants';
import { PAYMENT_STATUS } from '../eventRegistration';
import { paymentInfoSchema } from '../eventRegistration/eventRegistration.model';

const clubregistrationSchema = new Schema<IClubregistration, ClubregistrationModel>({
  club: { type: Schema.Types.ObjectId, ref: 'User', populate: { path: 'club', select: 'name lastName email profile phone ' } },
  member: { type: Schema.Types.ObjectId, ref: 'User', populate: { path: 'member', select: 'name lastName clubName email profile phone bloodGroup gender department year semester studentId address' } },
  paymentInfo: paymentInfoSchema,
  isPaymentRequired: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: PAYMENT_STATUS, default: PAYMENT_STATUS.PENDING },
  isApprovedByClub: { type: Boolean },
  status: { type: String, enum: CLUB_REGISTRATION_STATUS, default: CLUB_REGISTRATION_STATUS.PENDING },
  isCreatedByAdmin: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Clubregistration = model<IClubregistration, ClubregistrationModel>('Clubregistration', clubregistrationSchema);
