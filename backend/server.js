const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db');

const userRoutes = require('./src/routes/userRoutes');
const articleRoutes = require('./src/routes/articleRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('', userRoutes);
app.use('', articleRoutes);
// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err.stack);
  res.status(500).send('Something went wrong!');
});


// Connect to MongoDB
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));