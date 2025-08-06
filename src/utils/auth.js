const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No auth header or invalid format');
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', payload);

    const user = await User.findById(payload.userId);
    console.log('Authenticated user:', user?.email);

    console.log('User from DB:', user)

    return user;
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return null;
  }
};

