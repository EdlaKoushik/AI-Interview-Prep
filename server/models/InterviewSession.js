import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  mode: { type: String, enum: ['text', 'audio', 'video'], required: true },
  jobRole: { type: String, required: true },
  industry: { type: String },
  experience: { type: String },
  resumeText: { type: String },
  jobDescription: { type: String },
  questions: [{ type: String }],
  answers: [{ type: String }], // User answers
  feedback: [{ type: String }], // Per-question feedback
  overallFeedback: { type: String }, // Overall feedback
  status: { type: String, enum: ['created', 'in_progress', 'completed'], default: 'created' },
}, { timestamps: true });

export default interviewSessionSchema;
