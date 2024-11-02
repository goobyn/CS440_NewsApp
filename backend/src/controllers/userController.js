const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const eventBus = require('../events/eventBus');  // Import the event bus

// Register a new user and emit an event
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, interests } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      interests,
    });

    await user.save();

    // Emit an event for user registration
    eventBus.emit('userRegistered', user);
    res.status(201).json({ msg: 'User created successfully', user });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get user details by email
const getUser = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Login a user and emit an event
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Emit an event for user login
    eventBus.emit('userLoggedIn', user);
    res.status(200).json({ success: true, msg: 'Login successful', user });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Update user information
const updateUser = async (req, res) => {
  const { email } = req.params;
  const { firstName, lastName, newEmail, password, interests } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if the new email already exists in another user
    if (newEmail && newEmail !== email) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) return res.status(400).json({ msg: 'Email already exists' });
    }

    // Update fields if provided
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = newEmail || user.email;
    user.interests = interests || user.interests;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Emit an event for user update
    eventBus.emit('userUpdated', user);
    res.status(200).json({ msg: 'User updated successfully', user });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUser, getUser };
