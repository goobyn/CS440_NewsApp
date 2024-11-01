const mongoose = require('../db/mongoConnection');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  interests: [String],
});

module.exports = mongoose.model('User', userSchema);
