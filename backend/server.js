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
    res.json({ exists: !!user, userId: user?._id });
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
    const newUser = new User({ firstName, dob, email, isVerified: false });
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
    if (!user) return res.status(404).json({ message: 'user not found' });
    user.isVerified = true;
    await user.save();
    res.json({ message: 'user verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'server error', error: error.message });
  }
});

app.post('/api/friends', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).populate('friends', 'firstName email');
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ message: 'error fetching friends', error: err.message });
  }
});

app.post('/api/add-friend', async (req, res) => {
  const { userEmail, friendEmail } = req.body;
  try {
    const user = await User.findOne({ email: userEmail });
    const friend = await User.findOne({ email: friendEmail });
    if (!user || !friend) {
      return res.status(404).json({ message: 'user or friend not found' });
    }
    if (user._id.equals(friend._id)) {
      return res.status(400).json({ message: 'cannot add yourself' });
    }
    const alreadyFriends = user.friends.includes(friend._id);
    if (!alreadyFriends) {
      user.friends.push(friend._id);
      await user.save();
    }
    res.json({ message: 'friend added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'error adding friend', error: err.message });
  }
});

app.post('/api/send-friend-request', async (req, res) => {
  const { fromEmail, toEmail } = req.body;
  try {
    const fromUser = await User.findOne({ email: fromEmail });
    const toUser = await User.findOne({ email: toEmail });
    if (!fromUser || !toUser) return res.status(404).json({ message: 'User not found' });
    if (toUser.friendRequests.includes(fromUser._id)) return res.status(400).json({ message: 'Request already sent' });
    if (toUser.friends.includes(fromUser._id)) return res.status(400).json({ message: 'Already friends' });
    toUser.friendRequests.push(fromUser._id);
    await toUser.save();
    res.json({ message: 'Request sent' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friend-requests', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).populate('friendRequests', 'firstName email');
    res.json({ requests: user.friendRequests });
  } catch {
    res.status(500).json({ message: 'Failed to load requests' });
  }
});

app.post('/api/accept-friend-request', async (req, res) => {
  const { userEmail, requesterEmail } = req.body;
  try {
    const user = await User.findOne({ email: userEmail });
    const requester = await User.findOne({ email: requesterEmail });
    if (!user || !requester) return res.status(404).json({ message: 'User not found' });
    user.friends.push(requester._id);
    requester.friends.push(user._id);
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requester._id.toString());
    await user.save();
    await requester.save();
    res.json({ message: 'Friend request accepted' });
  } catch {
    res.status(500).json({ message: 'Failed to accept request' });
  }
});

app.post('/api/reject-friend-request', async (req, res) => {
  const { userEmail, requesterEmail } = req.body;
  try {
    const user = await User.findOne({ email: userEmail });
    const requester = await User.findOne({ email: requesterEmail });
    if (!user || !requester) return res.status(404).json({ message: 'User not found' });
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requester._id.toString());
    await user.save();
    res.json({ message: 'Friend request rejected' });
  } catch {
    res.status(500).json({ message: 'Failed to reject request' });
  }
});

app.post('/api/journal', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const lowercaseContent = content.toLowerCase();
    const newJournalEntry = new Journal({ userId, content: lowercaseContent });
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
