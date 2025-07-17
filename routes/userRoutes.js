const express = require('express');
const router = express.Router();
const User = require('/models/User');  // fixed relative path


// POST /api/register
router.post('/register', async (req, res) => {
  const { idNumber, firstName, lastName, dob } = req.body;

  try {
    const existingUser = await User.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = new User({ idNumber, firstName, lastName, dob });
    await newUser.save();

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


// POST /api/verify
router.post('/verify', async (req, res) => {
  const { idNumber, firstName, lastName, dob } = req.body;

  try {
    const user = await User.findOne({ idNumber });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Normalize strings for comparison
    const isMatch = 
      user.firstName.toLowerCase().trim() === firstName.toLowerCase().trim() &&
      user.lastName.toLowerCase().trim() === lastName.toLowerCase().trim() &&
      user.dob === dob;  // Assuming dob stored as string in same format

    if (isMatch) {
      return res.json({ success: true, message: 'Details match' });
    } else {
      return res.json({ success: false, message: 'Details do not match' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
