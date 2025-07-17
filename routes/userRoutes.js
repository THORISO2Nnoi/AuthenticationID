const express = require('express');
const router = express.Router();
const User = require('/models/User');

// POST /api/verify
router.post('/verify', async (req, res) => {
  const { idNumber, firstName, lastName, dob } = req.body;

  try {
    const user = await User.findOne({ idNumber });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (
      user.firstName === firstName &&
      user.lastName === lastName &&
      user.dob === dob
    ) {
      return res.json({ success: true, message: 'Details match' });
    } else {
      return res.json({ success: false, message: 'Details do not match' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }

});

// Example GET route
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // or res.json({ message: "Users route working" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
