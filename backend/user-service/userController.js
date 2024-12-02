const User = require('./userModel');
const bcrypt = require('bcryptjs');
const axios = require('axios');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    console.log('[User Service] Register User Request Body:', req.body);
    const { firstName, lastName, email, password, interests } = req.body;

    if (!firstName || !email || !password) {
      console.log('[User Service] Missing required fields');
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    console.log('[User Service] Checking if user exists...');
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('[User Service] User already exists');
      return res.status(400).json({ msg: 'User already exists' });
    }

    console.log('[User Service] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('[User Service] Creating user...');
    const user = new User({ firstName, lastName, email, password: hashedPassword, interests });
    await user.save();

    console.log('[User Service] User created successfully:', user);

    // Add user's interests to the Interest collection
    try {
      console.log('[User Service] Adding user interests to Interest Service...');
      await axios.post(`http://interest-service:3003/interests/${email}`, {
        categories: interests || [],
      });
      console.log('[User Service] User interests successfully added to Interest Service.');
    } catch (interestError) {
      console.error('[User Service] Error adding user interests:', interestError.message);
      return res.status(500).json({ msg: 'Error adding user interests', error: interestError.message });
    }

    res.status(201).json({
      msg: 'User created successfully',
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    console.error('[User Service] Error in registerUser:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  console.log('[User Service] Received login request with body:', req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[User Service] User not found:', email);
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('[User Service] Invalid password for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('[User Service] Login successful for user:', email);
    res.status(200).json({
      msg: 'Login successful',
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    console.error('[User Service] Error during login:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  console.log('[User Service] REQUEST RECEIVED');
  try {
    const { email } = req.params;
    const { firstName, lastName, newEmail, password } = req.body;

    console.log(`[User Service] Updating user: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = newEmail || email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    console.log(`[User Service] User updated successfully: ${email}`);
    res.status(200).json({ msg: 'User updated successfully' });
  } catch (error) {
    console.error('[User Service] Error updating user:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Fetch user details
exports.getUser = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
