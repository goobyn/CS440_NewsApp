const axios = require('axios');
const NEWS_API_KEY = '8b6ee44ff37e4e8db1490e37cb418075';

const getArticlesByCategory = async (category) => {
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=2&apiKey=${NEWS_API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data.articles.map((article) => ({ ...article, category }));
  } catch (error) {
    console.error(`Error fetching articles for ${category}:`, error.message);
    return [];
  }
};

exports.getNewsfeedByEmail = async (req, res) => {
  const { email } = req.params; // Extract email from route parameter
  console.log(`[Newsfeed Service] Received request for email: ${email}`);

  if (!email) {
    console.error('[Newsfeed Service] Email parameter is missing.');
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    // Fetch user interests from the interest service
    const getUserInterests = async (email) => {
      const response = await axios.get(`http://interest-service:3003/interests/${email}`);
      return response.data.categories;
    };

    // Call the function to get user interests
    const userInterests = await getUserInterests(email);

    if (!userInterests || userInterests.length === 0) {
      console.error(`[Newsfeed Service] No interests found for email: ${email}`);
      return res.status(404).json({ msg: 'No interests found for this user' });
    }

    let articles = [];

    for (const interest of userInterests) {
      const categoryArticles = await getArticlesByCategory(interest);
      articles = [...articles, ...categoryArticles];
    }

    console.log(`[Newsfeed Service] Retrieved articles for email: ${email}`);
    res.json({ articles });
  } catch (error) {
    console.error('[Newsfeed Service] Error fetching newsfeed:', error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
