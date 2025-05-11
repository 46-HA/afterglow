require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Journal = require('./models/Journal');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/api/get-user-name', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ name: user.firstName });
    } else {
      res.status(404).json({ name: '' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error finding user', error: err.message });
  }
});

app.post('/api/check-user', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: 'server error', error: error.message });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, dob, email } = req.body;

    if (!firstName || !dob || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'email already has an account' });
    }

    const newUser = new User({
      firstName,
      dob,
      email,
      isVerified: false
    });

    await newUser.save();
    res.status(201).json({ message: 'user created, verification pending' });
  } catch (error) {
    res.status(500).json({ message: 'server error', error: error.message });
  }
});

app.post('/api/verify', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    user.isVerified = true;
    await user.save();
    res.json({ message: 'user verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'server error', error: error.message });
  }
});

app.post('/api/journal', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const lowercaseContent = content.toLowerCase();
    const newJournalEntry = new Journal({
      userId,
      content: lowercaseContent
    });
    await newJournalEntry.save();
    res.status(201).json({ message: 'journal entry saved successfully', entry: newJournalEntry });
  } catch (error) {
    res.status(500).json({ message: 'server error', error: error.message });
  }
});

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/afterglow';

mongoose.set('strictQuery', false);
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('mongodb connected successfully'))
.catch(err => console.error('mongodb connection error:', err));

const PORT = process.env.PORT || 2044;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
