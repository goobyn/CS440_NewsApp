const express = require('express');
const { registerUser, loginUser, updateUser, getUser } = require('./userController');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.put('/:email', updateUser);
router.get('/:email', getUser);

module.exports = router;
