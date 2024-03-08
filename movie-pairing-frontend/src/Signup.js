const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
app.use(express.json());

// Assuming you've set up MongoDB models elsewhere and are importing them here
const User = require('../models/User'); // Update the path according to your project structure

// Replace '<your_mongodb_uri>' and '<your_jwt_secret>' with your actual MongoDB URI and JWT secret
const MONGODB_URI = 'mongodb+srv://lpb.nnnyft6.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=LPB';
const JWT_SECRET = '793888aedc4db5ac239bfa6fa1a02ed77a89e57f8286dea75b773fd6e94b6ef828acc7f7e0fe96ee2e1eb03718604058d9b7a6d897a660b39ae72450203acbed';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword
    });

    // Save user in the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
