const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection string (replace with your URI)
mongoose.connect('mongodb+srv://goobyn:dovah1337@cluster0.zp2le.mongodb.net/newsApp', 
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.log(err));

// User schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,  // This will be hashed
  interests: [String]  // List of user-selected interests
});

const User = mongoose.model('User', userSchema);

// Register a new user (save hashed password)
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, interests } = req.body;

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user with interests
  user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    interests: interests  // Set the selected interests
  });

  await user.save();
  res.status(201).json({ msg: 'User created successfully', user });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, msg: 'User not found' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, msg: 'Invalid credentials' });
  }

  // Success - Return user data
  res.status(200).json({ success: true, user });
});

// NewsAPI request
const NEWS_API_KEY = '8b6ee44ff37e4e8db1490e37cb418075';  // Replace with your actual API key
// Updated function to fetch articles and include category (interest)
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


// Route to get articles for a user based on their interests
app.get('/newsfeed/:email', async (req, res) => {
  const { email } = req.params;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const { interests } = user;
  let articles = [];

  // Fetch top 2 articles for each interest
  for (const interest of interests) {
    const interestArticles = await getArticlesByCategory(interest);
    articles = [...articles, ...interestArticles];  // Append articles
  }

  res.json({ articles });
});

app.put('/user/:email', async (req, res) => {
  const { email } = req.params;
  const { firstName, lastName, newEmail, password, interests } = req.body;

  // Check if new email already exists
  if (newEmail && newEmail !== email) {
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ msg: 'Email already exists' });
    }
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = newEmail || user.email;
    user.interests = interests || user.interests;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ msg: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error updating user' });
  }
});

// Route to get user details by email
app.get('/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send back the user's data
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
