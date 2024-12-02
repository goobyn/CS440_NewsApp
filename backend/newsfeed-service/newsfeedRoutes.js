const express = require('express');
const { getNewsfeedByEmail } = require('./newsfeedController');
const router = express.Router();

// Handle GET /newsfeed/:email
router.get('/:email', getNewsfeedByEmail);

module.exports = router;
