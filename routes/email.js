const express = require('express');
const nodemailer = require('nodemailer');
const Summary = require('../models/Summary');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Share summary via email
router.post('/share', auth, async (req, res) => {
  try {
    const { summaryId, recipients, subject, message } = req.body;

    if (!summaryId || !recipients || recipients.length === 0) {
      return res.status(400).json({ message: 'Summary ID and recipients are required' });
    }

    // Get the summary
    const summary = await Summary.findOne({
      _id: summaryId,
      user: req.user._id
    });

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    // Prepare email content
    const emailContent = `
      <h2>${summary.title || 'Meeting Summary'}</h2>
      <p><strong>From:</strong> ${req.user.name} (${req.user.email})</p>
      <p><strong>Message:</strong> ${message || 'Please find the meeting summary attached.'}</p>
      <hr>
      <h3>Summary:</h3>
      <div style="white-space: pre-wrap;">${summary.editedSummary || summary.generatedSummary}</div>
      <hr>
      <p><strong>Original Prompt:</strong> ${summary.customPrompt}</p>
      <p><strong>Generated on:</strong> ${new Date(summary.createdAt).toLocaleString()}</p>
    `;

    // Send email to each recipient
    const emailPromises = recipients.map(async (recipient) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject || `Meeting Summary: ${summary.title}`,
        html: emailContent,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.json({
      message: 'Summary shared successfully',
      recipientsCount: recipients.length
    });
  } catch (error) {
    console.error('Email sharing error:', error);
    res.status(500).json({ message: 'Error sharing summary via email' });
  }
});

// Test email configuration
router.post('/test', auth, async (req, res) => {
  try {
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'Email Configuration Test',
      html: `
        <h2>Email Configuration Test</h2>
        <p>If you received this email, your email configuration is working correctly!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(testMailOptions);

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Error sending test email' });
  }
});

module.exports = router; 