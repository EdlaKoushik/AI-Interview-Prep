import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.js';
import { generateQuestions, getFeedback } from '../utils/gemini.js';

// Create interview session
export const createInterview = async (req, res, next) => {
  try {
    const { mode, jobRole, industry, experience, resumeUrl, resumeText, jobDescription } = req.body;
    const userId = req.auth?.userId || req.user?.id;
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const interview = await InterviewSession.create({
      user: user._id,
      mode,
      jobRole,
      industry,
      experience,
      resumeUrl,
      resumeText, // Store resume text
      jobDescription,
      status: 'created',
    });
    res.status(201).json({ success: true, interview });
  } catch (err) {
    next(err);
  }
};

// Start interview (generate questions)
export const startInterview = async (req, res, next) => {
  try {
    const { interviewId, resumeText } = req.body;
    const interview = await InterviewSession.findById(interviewId);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    // Generate questions using Gemini, now with resumeText if provided
    const questions = await generateQuestions(
      interview.jobRole,
      interview.industry,
      interview.experience,
      interview.jobDescription,
      resumeText // may be undefined if not provided
    );
    interview.questions = questions;
    interview.status = 'in_progress';
    await interview.save();
    res.status(200).json({ success: true, questions });
  } catch (err) {
    next(err);
  }
};

// Submit interview (save responses & feedback)
export const submitInterview = async (req, res, next) => {
  try {
    const { interviewId, responses } = req.body;
    const interview = await InterviewSession.findById(interviewId);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    // Get AI feedback for each response
    const feedbackResults = await Promise.all(responses.map(async (resp) => {
      const feedback = await getFeedback(resp.question, resp.answer);
      return { ...resp, feedback: feedback.text, score: feedback.score };
    }));
    interview.responses = feedbackResults;
    interview.status = 'completed';
    await interview.save();
    res.status(200).json({ success: true, feedback: feedbackResults });
  } catch (err) {
    next(err);
  }
};
