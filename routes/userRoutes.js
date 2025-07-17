const express = require('express');
const router = express.Router();
const User = require('..models/User');

// POST /api/register
router.post('/register', async (req, res) => {
  const { idNumber, firstName, lastName, dob } = req.body;

  try {
    const existing = await User.findOne({ idNumber });
    if (existing) return res.status(400).json({ success: false, message: 'User already exists' });

    const newUser = new User({ idNumber, firstName, lastName, dob });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});

// POST /api/verify
router.post('/verify', async (req, res) => {
  const { idNumber, firstName, lastName, dob } = req.body;

  try {
    const user = await User.findOne({ idNumber });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (
      user.firstName === firstName &&
      user.lastName === lastName &&
      user.dob === dob
    ) {
      return res.json({ success: true, message: 'Details match' });
    } else {
      return res.json({ success: false, message: 'Details do not match' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
