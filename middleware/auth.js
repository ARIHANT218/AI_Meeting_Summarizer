const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Bypass authentication for development - always set mock user
    req.user = {
      _id: 'mock-user-id',
      name: 'Demo User',
      email: 'demo@example.com'
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Even if there's an error, set mock user
    req.user = {
      _id: 'mock-user-id',
      name: 'Demo User',
      email: 'demo@example.com'
    };
    next();
  }
};

module.exports = auth; 