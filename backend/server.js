require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const mongoose = require('mongoose');
const express = require('express');


const app = express();

app.use(cors({
    orgin: 'http://localhost:5173',
    methods: ["GET", 'POST', "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

mongoose.set('strictQuery', false);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/afterglow';
console.log('Attempting to connect to MongoDB with URI:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/api/check-user', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.log(`test ${process.env.MONGODB_URI}`)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, dob, email } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already has an account' });
    }
    
    const newUser = new User({
      firstName,
      dob,
      email,
      isVerified: false
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User created, verification pending' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/verify', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isVerified = true;
    await user.save();
    
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));