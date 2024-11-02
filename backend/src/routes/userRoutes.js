const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/user/:email', userController.updateUser);
router.get('/user/:email', userController.getUser);

module.exports = router;
