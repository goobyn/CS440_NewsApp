const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  categories: [String],
});

module.exports = mongoose.model('Interest', interestSchema);
