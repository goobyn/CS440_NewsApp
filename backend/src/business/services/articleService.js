const axios = require('axios');

const NEWS_API_KEY = '8b6ee44ff37e4e8db1490e37cb418075';

const getArticlesByCategory = async (category) => {
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=2&apiKey=${NEWS_API_KEY}`;
  try {
    const response = await axios.get(url);
    // Add the category to each article object
    const articlesWithCategory = response.data.articles.map(article => ({
      ...article,
      category // Include category in the article object
    }));
    return articlesWithCategory;  // Return the articles with category
  } catch (error) {
    console.error(`Error fetching articles for ${category}:`, error);
    return [];
  }
};

module.exports = { getArticlesByCategory };
