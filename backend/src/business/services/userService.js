const User = require('../../data-access/models/User');
const bcrypt = require('bcryptjs');

// Register a new user
const registerUser = async (userData) => {
  const { firstName, lastName, email, password, interests } = userData;
  
  let user = await User.findOne({ email });
  if (user) throw new Error('User already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    interests,
  });

  return await user.save();
};

// Login a user
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  console.log("Logging in user", user);
  return user;
};

// Update user information
const updateUser = async (email, updateData) => {
  const { firstName, lastName, newEmail, password, interests } = updateData;

  // Check if the new email already exists in another user
  if (newEmail && newEmail !== email) {
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) throw new Error('Email already exists');
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

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

  return await user.save();
};

// Get user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = { registerUser, loginUser, updateUser, getUserByEmail };
