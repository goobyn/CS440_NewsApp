const axios = require('axios');
const User = require('../models/userModel');
const eventBus = require('../events/eventBus');  // Import the event bus

const NEWS_API_KEY = '8b6ee44ff37e4e8db1490e37cb418075';

// Helper function to fetch articles by category
const getArticlesByCategory = async (category) => {
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=2&apiKey=${NEWS_API_KEY}`;
  try {
    const response = await axios.get(url);
    const articlesWithCategory = response.data.articles.map(article => ({
      ...article,
      category  // Add category to each article
    }));
    return articlesWithCategory;
  } catch (error) {
    console.error(`Error fetching articles for ${category}:`, error);
    return [];
  }
};

// Controller function to get newsfeed for a user and emit an event
const getNewsfeed = async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch articles for each interest category
    const articles = await Promise.all(
      user.interests.map(interest => getArticlesByCategory(interest))
    );

    // Emit an event for articles fetched
    eventBus.emit('articlesFetched', articles.flat());
    res.json({ articles: articles.flat() });
  } catch (error) {
    console.error('Error fetching newsfeed:', error);
    res.status(500).json({ msg: 'Error fetching newsfeed' });
  }
};

module.exports = { getNewsfeed, getArticlesByCategory };
