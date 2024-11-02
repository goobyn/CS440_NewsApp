const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/newsfeed/:email', articleController.getNewsfeed);

module.exports = router;
