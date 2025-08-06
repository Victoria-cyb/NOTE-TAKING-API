const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
  },
  Mutation: {
    register: async (_, { firstName, lastName, email, password }) => {
        console.log('Register inputs:', { email, password, firstName, lastName });
      if (!firstName || !lastName) {
        throw new Error('firstName and lastName must not be empty');
      }
      const user = new User({ firstName, lastName, email, password });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user };
    },
  },
};