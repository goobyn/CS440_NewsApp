const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const interestRoutes = require('./interestRoutes');

const app = express();
app.use(
    cors({
      origin: '*', 
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
app.use(bodyParser.json());

mongoose
  .connect('mongodb+srv://goobyn:dovah1337@cluster0.zp2le.mongodb.net/interests', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('[Interest Service] MongoDB connected successfully'))
  .catch(err => console.error('[Interest Service] MongoDB connection error:', err));

app.use('/interests', interestRoutes);

const PORT = 3003;
app.listen(PORT, () => console.log(`Interest Service running on port ${PORT}`));
