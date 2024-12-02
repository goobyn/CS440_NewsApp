const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');

const app = express();

// Body parser middleware
app.use(bodyParser.json());

// CORS Configuration
app.use(
  cors({
    origin: '*', // Allow all origins for development purposes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight requests
app.options('*', (req, res) => {
  console.log('[User Service] CORS preflight request');
  res.sendStatus(200);
});

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`[User Service] Incoming Request: ${req.method} ${req.url}`);
  console.log(`[User Service] Headers:`, req.headers);
  console.log(`[User Service] Body:`, req.body);
  next();
});

// MongoDB Connection
mongoose
  .connect('mongodb+srv://goobyn:dovah1337@cluster0.zp2le.mongodb.net/newsApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('[User Service] MongoDB connected successfully'))
  .catch(err => console.error('[User Service] MongoDB connection error:', err));

// Log MongoDB queries and set a query timeout
mongoose.set('debug', true);
mongoose.set('maxTimeMS', 5000);

// Route handling
app.use('/user', userRoutes);

// Default error handler
app.use((err, req, res, next) => {
  console.error('[User Service] Unhandled error:', err.message);
  res.status(500).json({ msg: 'Internal server error' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[User Service] Running on port ${PORT}`);
});
