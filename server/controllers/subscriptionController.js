import Stripe from 'stripe';
import User from '../models/User.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/checkout
export const checkout = async (req, res, next) => {
  try {
    const { clerkUserId, email } = req.body;
    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Premium Subscription' },
          unit_amount: 990,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancel`,
      metadata: { clerkUserId },
    });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// GET /api/payment/status/:userId
export const getStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ subscriptionTier: user.subscriptionTier });
  } catch (err) {
    next(err);
  }
};
