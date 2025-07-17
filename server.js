require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const User = require('./models/User');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 chars
const IV_LENGTH = 16;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Encryption helper functions
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  let parts = text.split(':');
  let iv = Buffer.from(parts.shift(), 'hex');
  let encryptedText = Buffer.from(parts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

// Verify endpoint
app.post('/verify-id', async (req, res) => {
  const { idNumber, firstName, lastName, dateOfBirth } = req.body;

  if (!idNumber || !firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Encrypt ID to search
    const encryptedId = encrypt(idNumber);

    // Find user by encrypted ID
    const user = await User.findOne({ idNumberEncrypted: encryptedId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'ID number not found' });
    }

    // Compare details case-insensitive
    if (
      user.firstName.toLowerCase() === firstName.toLowerCase() &&
      user.lastName.toLowerCase() === lastName.toLowerCase() &&
      user.dateOfBirth === dateOfBirth
    ) {
      return res.json({ success: true, message: 'User verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Details do not match ID record' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
