import express from 'express';
import { requireClerkAuth, attachUserInfo } from '../middlewares/auth.js';
import {
  createInterview,
  startInterview,
  submitInterview
} from '../controllers/interviewController.js';

const router = express.Router();

// POST /api/interview/create
router.post('/create', requireClerkAuth, attachUserInfo, createInterview);

// POST /api/interview/start
router.post('/start', requireClerkAuth, attachUserInfo, startInterview);

// POST /api/interview/submit
router.post('/submit', requireClerkAuth, attachUserInfo, submitInterview);

// GET /api/interview/:id
router.get('/:id', requireClerkAuth, attachUserInfo, async (req, res, next) => {
  try {
    const interview = await (await import('../models/InterviewSession.js')).default.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json({ success: true, interview });
  } catch (err) {
    next(err);
  }
});

export default router;
