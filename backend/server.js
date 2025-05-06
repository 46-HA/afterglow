require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const mongoose = require('mongoose');
const express = require('express');
const Journal = require('./models/Journal');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", 'POST', "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

mongoose.set('strictQuery', false);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/afterglow';
console.log('attempting to connect to mongodb with uri:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('mongodb connected successfully'))
.catch(err => console.error('mongodb connection error:', err));

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
    res.status(500).json({ message: 'server error', error: error.message });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, dob, email } = req.body;
    
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
