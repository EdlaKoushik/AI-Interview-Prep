import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// ⬇️ Switch to Together AI generator
import { generateQuestions } from './utils/together.js';
import multer from 'multer';
import axios from 'axios';
import Stripe from 'stripe';
// Import InterviewSession model from models directory
import interviewSessionSchema from './models/InterviewSession.js';
// User model
import User from './models/User.js';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the imported schema for the InterviewSession model
const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

// Multer setup for audio and video uploads
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Prep API is running' });
});

// ✅ Create interview session
app.post('/api/interview/create', async (req, res) => {
  try {
    console.log('Received interview creation request:', req.body);
    const { mode, jobRole, industry, experience, resumeText, jobDescription } = req.body;
    const userId = req.user?.id || req.user?._id || req.body.userId || null;
    if (!jobRole || !experience) {
      return res.status(400).json({ message: 'Job role and experience are required' });
    }
    // Enforce free tier limit: 3 interviews/month
    let isPremium = false;
    if (userId) {
      const user = await User.findOne({ clerkUserId: userId });
      isPremium = user && user.plan === 'Premium';
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0,0,0,0);
      const interviewCount = await InterviewSession.countDocuments({
        'userId': userId,
        createdAt: { $gte: startOfMonth },
      });
      if (!isPremium && interviewCount >= 3) {
        return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Premium for unlimited interviews.' });
      }
    }
    const interview = await InterviewSession.create({
      mode,
      jobRole,
      industry,
      experience,
      resumeText,
      jobDescription,
      status: 'created',
      ...(userId && { userId })
    });
    res.status(201).json({ success: true, interview });
  } catch (err) {
    console.error('Error creating interview:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Generate questions and update session
app.post('/api/interview/start', async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await InterviewSession.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const questions = await generateQuestions(
      interview.jobRole,
      interview.industry,
      interview.experience,
      interview.jobDescription,
      interview.resumeText
    );

    interview.questions = questions;
    interview.status = 'in_progress';
    await interview.save();

    res.status(200).json({ success: true, questions });
  } catch (err) {
    console.error('Error generating questions:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all interview sessions (for dashboard)
app.get('/api/interview/all', async (req, res) => {
  try {
    const interviews = await InterviewSession.find().sort({ createdAt: -1 });
    res.json({ interviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get interview session by id
app.get('/api/interview/:id', async (req, res) => {
  try {
    const interview = await InterviewSession.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.json({ success: true, interview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Video upload endpoint for video mode answers
app.post('/api/interview/upload-video', upload.single('video'), async (req, res) => {
  try {
    const { interviewId, questionIndex } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded.' });
    }
    const interview = await InterviewSession.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    // Store video as base64 in answers array for demo (in production, use cloud/file storage)
    const videoBase64 = req.file.buffer.toString('base64');
    if (!interview.answers) interview.answers = [];
    interview.answers[questionIndex] = { video: videoBase64, mimetype: req.file.mimetype };
    await interview.save();
    res.status(200).json({ success: true, message: 'Video uploaded and saved.' });
  } catch (err) {
    console.error('Error uploading video:', err);
    res.status(500).json({ message: err.message });
  }
});

// Submit interview answers and generate feedback
app.post('/api/interview/submit', async (req, res) => {
  try {
    const { interviewId, answers, mode } = req.body;
    console.log('Received submit:', { interviewId, answers, mode });
    const interview = await InterviewSession.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    interview.answers = answers;
    // Generate per-question feedback (dummy for now, replace with AI call)
    let feedback;
    if (mode === 'video') {
      feedback = answers.map((ans, idx) =>
        ans && ans.video
          ? `Good video answer for Q${idx + 1}. Eye contact and clarity are important!`
          : `No video answer provided for Q${idx + 1}.`
      );
    } else {
      feedback = answers.map((ans, idx) =>
        ans && ans.length > 0
          ? `Good answer for Q${idx + 1}.`
          : `No answer provided for Q${idx + 1}.`
      );
    }
    // Generate overall feedback (dummy for now, replace with AI call)
    let overallFeedback;
    if (mode === 'video') {
      overallFeedback = 'Great presence! Work on body language and confidence.';
    } else if (mode === 'audio') {
      overallFeedback = 'Great communication skills! Work on clarity and pacing.';
    } else {
      overallFeedback = 'Well-structured answers. Try to be more concise.';
    }
    interview.feedback = feedback;
    interview.overallFeedback = overallFeedback;
    interview.status = 'completed';
    await interview.save();
    console.log('Saved interview:', {
      answers: interview.answers,
      feedback: interview.feedback,
      overallFeedback: interview.overallFeedback,
    });
    res.status(200).json({ success: true, feedback, overallFeedback });
  } catch (err) {
    console.error('Error submitting interview:', err);
    res.status(500).json({ message: err.message });
  }
});

// Whisper transcription endpoint
app.post('/api/interview/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded.' });
    }
    // Call OpenAI Whisper API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ message: 'OpenAI API key not set.' });
    }
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname || 'audio.webm',
      contentType: req.file.mimetype || 'audio/webm',
    });
    formData.append('model', 'whisper-1');
    // Optionally: language, prompt, etc.
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${openaiApiKey}`,
        },
        maxBodyLength: Infinity,
      }
    );
    res.json({ text: response.data.text });
  } catch (err) {
    console.error('Whisper transcription error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Transcription failed', error: err.response?.data || err.message });
  }
});

// Stripe Checkout session endpoint
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { clerkUserId, email } = req.body;
    if (!clerkUserId || !email) {
      return res.status(400).json({ message: 'Missing user info' });
    }
    // Find or create user
    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = await User.create({ clerkUserId, email });
    }
    // Create Stripe customer if not exists
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { clerkUserId },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }
    // Create Stripe Checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID, // Set this in your .env
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/upgrade?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/upgrade?canceled=1`,
      metadata: { clerkUserId },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
