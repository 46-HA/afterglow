// models/User.js - Make sure to fix the required field format
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true 
  },
  dob: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // 👈 added
});



module.exports = mongoose.model('User', UserSchema);