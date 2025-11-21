const Feedback = require('../models/Feedback');

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const { rating, experience, tmfcid, comments } = req.body;

    // Validate required fields
    if (!rating || !experience || !tmfcid) {
      return res.status(400).json({
        error: 'Rating, experience, and tmfcid are required fields'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if feedback with this tmfcid already exists
    const existingFeedback = await Feedback.findOne({ tmfcid });
    if (existingFeedback) {
      return res.status(400).json({
        error: 'Feedback with this TMFC ID already exists'
      });
    }

    // Create new feedback
    const feedback = new Feedback({
      rating,
      experience,
      tmfcid,
      comments: comments || ''
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback._id,
        rating: feedback.rating,
        experience: feedback.experience,
        tmfcid: feedback.tmfcid,
        comments: feedback.comments,
        createdAt: feedback.createdAt
      }
    });

  } catch (error) {
    console.error('Create feedback error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Feedback with this TMFC ID already exists'
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get all feedback (admin functionality)
const getAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments();

    res.json({
      feedback,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get feedback by TMFC ID
const getFeedbackById = async (req, res) => {
  try {
    const { tmfcid } = req.params;

    const feedback = await Feedback.findOne({ tmfcid });
    
    if (!feedback) {
      return res.status(404).json({
        error: 'Feedback not found'
      });
    }

    res.json({ feedback });

  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById
};