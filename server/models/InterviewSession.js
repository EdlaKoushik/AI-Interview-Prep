import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mode: { type: String, enum: ['text', 'audio', 'video'], required: true },
  jobRole: { type: String, required: true },
  industry: { type: String },
  experience: { type: String },
  resumeUrl: { type: String },
  resumeText: { type: String }, // Store extracted resume text
  jobDescription: { type: String },
  questions: [{ type: String }],
  responses: [{
    question: String,
    answer: String,
    feedback: String,
    score: Number,
  }],
  aiFeedback: { type: String },
  status: { type: String, enum: ['created', 'in_progress', 'completed'], default: 'created' },
}, { timestamps: true });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
