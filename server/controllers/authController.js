import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Clerk/JWT signup
export const signup = async (req, res, next) => {
  try {
    const { clerkUserId, email } = req.body;
    let user = await User.findOne({ clerkUserId });
    if (user) return res.status(400).json({ message: 'User already exists' });
    user = await User.create({ clerkUserId, email });
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// Clerk/JWT login
export const login = async (req, res, next) => {
  try {
    const { clerkUserId, email } = req.body;
    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = await User.create({ clerkUserId, email });
    }
    // Issue JWT for non-Clerk clients (optional)
    const token = jwt.sign({ id: user._id, clerkUserId: user.clerkUserId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
};
