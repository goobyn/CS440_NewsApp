const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  category: String
});

module.exports = mongoose.model('Article', articleSchema);
