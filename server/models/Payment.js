import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripeSessionId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  subscriptionTier: { type: String, enum: ['free', 'premium'], default: 'free' },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
