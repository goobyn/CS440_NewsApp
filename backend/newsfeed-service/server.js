const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const newsfeedRoutes = require('./newsfeedRoutes');

const app = express();
app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
app.use(bodyParser.json());

app.use('/newsfeed', newsfeedRoutes);

const PORT = 3002;
app.listen(PORT, () => console.log(`Newsfeed Service running on port ${PORT}`));
