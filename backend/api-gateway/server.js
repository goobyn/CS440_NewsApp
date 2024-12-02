const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins for development purposes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});


// app.use(bodyParser.json());

// Use API Gateway routes
app.use('/', routes);

// Start the server
const PORT = 4000; // The API Gateway port
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
