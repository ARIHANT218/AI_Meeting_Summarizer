const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Summary = require('../models/Summary');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test route to check available models
router.get('/test-models', async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json({ models: models.data });
  } catch (error) {
    console.error('Error listing models:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate summary using AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { originalText, customPrompt, title } = req.body;

    if (!originalText || !customPrompt) {
      return res.status(400).json({ message: 'Original text and custom prompt are required' });
    }

    // Generate summary using Gemini
    let model;
    let generatedSummary;
    
    try {
      // Use the correct Gemini model
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are a professional meeting summarizer. Create clear, structured summaries based on the user's specific requirements.

Original text: ${originalText}

Custom instruction: ${customPrompt}

Please provide a well-structured summary based on the custom instruction.`;

      const result = await model.generateContent(prompt);
      generatedSummary = result.response.text();
    } catch (modelError) {
      console.error('Model error:', modelError);
      throw new Error('Failed to generate content with AI model');
    }

    // Create new summary
    const summary = new Summary({
      user: req.user._id,
      originalText,
      customPrompt,
      generatedSummary,
      editedSummary: generatedSummary,
      title: title || 'Untitled Summary'
    });

    await summary.save();

    res.status(201).json({
      message: 'Summary generated successfully',
      summary: summary,
      generatedSummary: generatedSummary
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ message: 'Error generating summary' });
  }
});

// Get all summaries for a user
router.get('/', auth, async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(summaries);
  } catch (error) {
    console.error('Get summaries error:', error);
    res.status(500).json({ message: 'Error fetching summaries' });
  }
});

// Get single summary
router.get('/:id', auth, async (req, res) => {
  try {
    const summary = await Summary.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    res.json(summary);
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Error fetching summary' });
  }
});

// Update summary (edit)
router.put('/:id', auth, async (req, res) => {
  try {
    const { editedSummary, title, tags } = req.body;

    const summary = await Summary.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      {
        editedSummary,
        title,
        tags,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    res.json({
      message: 'Summary updated successfully',
      summary
    });
  } catch (error) {
    console.error('Update summary error:', error);
    res.status(500).json({ message: 'Error updating summary' });
  }
});

// Delete summary
router.delete('/:id', auth, async (req, res) => {
  try {
    const summary = await Summary.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    res.json({ message: 'Summary deleted successfully' });
  } catch (error) {
    console.error('Delete summary error:', error);
    res.status(500).json({ message: 'Error deleting summary' });
  }
});

module.exports = router; 