import { Schema, model } from 'mongoose';
import { IPayment, PaymentModel } from './payment.interface'; 
import { PaymentMode, PaymentStatus, PaymentType } from '../../../enum/payment';

const paymentSchema = new Schema<IPayment, PaymentModel>({
  club: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  amount: { type: Number },
  status: { type: String, enum:[PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.FAILED] },
  transactionId: { type: String },
  paymentMode: { type: String, enum:[PaymentMode.CASH, PaymentMode.ONLINE] },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum:[PaymentType.CLUB, PaymentType.EVENT] },
  verified: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Payment = model<IPayment, PaymentModel>('Payment', paymentSchema);
