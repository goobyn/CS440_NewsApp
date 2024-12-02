const express = require('express');
const { getInterests, updateInterests } = require('./interestController');
const router = express.Router();

// Route to get user interests
router.get('/:email', getInterests);

// Route to update user interests
router.post('/:email', updateInterests);

module.exports = router;
