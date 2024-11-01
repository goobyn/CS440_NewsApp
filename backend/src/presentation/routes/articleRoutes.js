const express = require('express');
const articleController = require('../controllers/articleController');
const router = express.Router();

router.get('/newsfeed/:email', articleController.getNewsfeed);

module.exports = router;
