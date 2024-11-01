const articleService = require('../../business/services/articleService');
const userService = require('../../business/services/userService');  // Needed for user interests

const getNewsfeed = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const articles = await Promise.all(
      user.interests.map(interest => articleService.getArticlesByCategory(interest))
    );

    res.json({ articles: articles.flat() });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching newsfeed' });
  }
};

module.exports = { getNewsfeed };
