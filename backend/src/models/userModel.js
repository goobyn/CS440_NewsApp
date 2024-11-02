// src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,  // This will be hashed
  interests: [String]  // List of user-selected interests
});

const User = mongoose.model('User', userSchema);
module.exports = User;
