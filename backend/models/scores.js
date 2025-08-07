const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Score', scoreSchema);
