const Interest = require('./interestModel');

// Get user interests
exports.getInterests = async (req, res) => {
  const { email } = req.params;
  console.log(`[Interest Service] Received request to get interests for email: ${email}`);

  if (!email) {
    console.error('[Interest Service] Email parameter is missing.');
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    const interests = await Interest.findOne({ email });
    if (!interests) {
      console.log(`[Interest Service] No interests found for email: ${email}`);
      return res.status(404).json({ msg: 'Interests not found' });
    }

    console.log(`[Interest Service] Found interests for email: ${email}`, interests);
    res.json(interests);
  } catch (error) {
    console.error('[Interest Service] Error getting interests:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Update user interests
exports.updateInterests = async (req, res) => {
  const { email } = req.params;
  const { categories } = req.body;

  console.log(`[Interest Service] Received request to update interests for: ${email}`);
  console.log(`[Interest Service] Categories received: ${categories}`);

  if (!email || !categories) {
    console.error('[Interest Service] Missing email or categories in the request.');
    return res.status(400).json({ msg: 'Email and categories are required.' });
  }

  try {
    const interests = await Interest.findOneAndUpdate(
      { email },
      { categories },
      { new: true, upsert: true }
    );

    console.log(`[Interest Service] Updated interests for ${email}:`, interests);
    res.status(200).json({ msg: 'Interests updated successfully', interests });
  } catch (error) {
    console.error('[Interest Service] Error updating interests:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

