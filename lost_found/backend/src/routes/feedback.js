const express = require('express');
const { 
  createFeedback, 
  getAllFeedback, 
  getFeedbackById 
} = require('../controllers/feedbackController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/feedback - Create new feedback
router.post('/', createFeedback);

// GET /api/feedback - Get all feedback (requires authentication)
router.get('/', auth, getAllFeedback);

// GET /api/feedback/:tmfcid - Get feedback by TMFC ID
router.get('/:tmfcid', getFeedbackById);

module.exports = router;