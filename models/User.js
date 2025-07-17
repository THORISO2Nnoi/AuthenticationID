const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  dob: String // Format: "YYYY-MM-DD"
});

module.exports = mongoose.model('User', userSchema);
