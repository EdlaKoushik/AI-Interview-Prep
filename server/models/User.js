import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  plan: { type: String, enum: ['Free', 'Premium'], default: 'Free' },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
