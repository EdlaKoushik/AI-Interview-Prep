import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  subscriptionTier: { type: String, enum: ['free', 'premium'], default: 'free' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
