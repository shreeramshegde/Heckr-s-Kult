const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  lostPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  foundPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  matchDetails: {
    categoryMatch: Boolean,
    colorMatch: Boolean,
    dateProximity: Number,
    textSimilarity: Number,
    locationMatch: Boolean
  },
  notified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', matchSchema);
