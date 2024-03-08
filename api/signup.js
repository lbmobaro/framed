// Import necessary libraries
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
app.use(express.json());

// MongoDB User model (simplified version)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Connect to MongoDB (ensure to replace <your_mongodb_uri> with your actual MongoDB URI)
mongoose.connect('mongodb+srv://lpb.nnnyft6.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=LPB', { useNewUrlParser: true, useUnifiedTopology: true });

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign({ userId: user._id }, '793888aedc4db5ac239bfa6fa1a02ed77a89e57f8286dea75b773fd6e94b6ef828acc7f7e0fe96ee2e1eb03718604058d9b7a6d897a660b39ae72450203acbed', { expiresIn: '24h' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up', error });
    }
});

// Vercel requires module.exports
module.exports = app;
