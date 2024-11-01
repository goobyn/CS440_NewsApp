const userService = require('../../business/services/userService');

// Register a new user
const signup = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ msg: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Login an existing user
const login = async (req, res) => {
  try {
    const user = await userService.loginUser(req.body.email, req.body.password);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

// Update user details
const updateUser = async (req, res) => {
  const { email } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await userService.updateUser(email, updateData);
    res.status(200).json({ msg: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Get user details by email
const getUser = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await userService.getUserByEmail(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports = { signup, login, updateUser, getUser };
