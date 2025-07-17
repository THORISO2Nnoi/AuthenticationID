const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idNumberEncrypted: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: String, required: true }, // format: YYYY-MM-DD
});

module.exports = mongoose.model('User', userSchema);
