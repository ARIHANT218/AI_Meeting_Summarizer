const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  customPrompt: {
    type: String,
    required: true
  },
  generatedSummary: {
    type: String,
    required: true
  },
  editedSummary: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Untitled Summary'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
summarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Summary', summarySchema); 