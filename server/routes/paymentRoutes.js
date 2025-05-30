import express from 'express';
import { requireClerkAuth } from '../middlewares/auth.js';
import { checkout, getStatus } from '../controllers/subscriptionController.js';

const router = express.Router();

// POST /api/payment/checkout
router.post('/checkout', requireClerkAuth, checkout);

// GET /api/payment/status/:userId
router.get('/status/:userId', requireClerkAuth, getStatus);

export default router;
