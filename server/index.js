// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { generateQuestions } from './utils/gemini.js';

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: ['http://localhost:5174', 'http://localhost:5173'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Interview Session Schema
// const interviewSessionSchema = new mongoose.Schema({
//   mode: { type: String, enum: ['text', 'audio', 'video'], required: true },
//   jobRole: { type: String, required: true },
//   industry: { type: String },
//   experience: { type: String },
//   resumeText: { type: String },
//   jobDescription: { type: String },
//   questions: [{ type: String }],
//   status: { type: String, enum: ['created', 'in_progress', 'completed'], default: 'created' },
// }, { timestamps: true });

// const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

// // Routes
// app.get('/', (req, res) => {
//   res.json({ message: 'AI Interview Prep API is running' });
// });

// // Create interview session
// app.post('/api/interview/create', async (req, res) => {
//   try {
//     console.log('Received interview creation request:', req.body);
//     const { mode, jobRole, industry, experience, resumeText, jobDescription } = req.body;
    
//     if (!jobRole || !experience) {
//       console.log('Missing required fields:', { jobRole, experience });
//       return res.status(400).json({ message: 'Job role and experience are required' });
//     }
    
//     const interview = await InterviewSession.create({
//       mode, jobRole, industry, experience, resumeText, jobDescription,
//       status: 'created'
//     });
    
//     console.log('Interview created successfully:', interview._id);
//     res.status(201).json({ success: true, interview });
//   } catch (err) {
//     console.error('Error creating interview:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Generate questions and update session
// app.post('/api/interview/start', async (req, res) => {
//   try {
//     console.log('Received question generation request:', req.body);
//     const { interviewId } = req.body;
    
//     const interview = await InterviewSession.findById(interviewId);
//     if (!interview) {
//       console.log('Interview not found:', interviewId);
//       return res.status(404).json({ message: 'Interview not found' });
//     }

//     console.log('Generating questions for interview:', interviewId);
//     const questions = await generateQuestions(
//       interview.jobRole,
//       interview.industry,
//       interview.experience,
//       interview.jobDescription,
//       interview.resumeText
//     );

//     interview.questions = questions;
//     interview.status = 'in_progress';
//     await interview.save();

//     console.log('Questions generated successfully:', questions.length);
//     res.status(200).json({ success: true, questions });
//   } catch (err) {
//     console.error('Error generating questions:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get interview session
// app.get('/api/interview/:id', async (req, res) => {
//   try {
//     const interview = await InterviewSession.findById(req.params.id);
//     if (!interview) {
//       return res.status(404).json({ message: 'Interview not found' });
//     }
//     res.json({ success: true, interview });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// ⬇️ Switch to Together AI generator
import { generateQuestions } from './utils/together.js';

dotenv.config();

const app = express();

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

// Interview Session Schema (✅ includes jobDescription)
const interviewSessionSchema = new mongoose.Schema({
  mode: { type: String, enum: ['text', 'audio', 'video'], required: true },
  jobRole: { type: String, required: true },
  industry: { type: String },
  experience: { type: String },
  resumeText: { type: String },
  jobDescription: { type: String },
  questions: [{ type: String }],
  status: { type: String, enum: ['created', 'in_progress', 'completed'], default: 'created' },
}, { timestamps: true });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Prep API is running' });
});

// ✅ Create interview session
app.post('/api/interview/create', async (req, res) => {
  try {
    console.log('Received interview creation request:', req.body);
    const { mode, jobRole, industry, experience, resumeText, jobDescription } = req.body;

    if (!jobRole || !experience) {
      return res.status(400).json({ message: 'Job role and experience are required' });
    }

    const interview = await InterviewSession.create({
      mode,
      jobRole,
      industry,
      experience,
      resumeText,
      jobDescription,
      status: 'created'
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

// Get interview session
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

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
