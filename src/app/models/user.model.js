const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, minlength: 6, required: true },
  verified: { type: Boolean, default: false },
  address: { type: String },
});

module.exports = mongoose.model('Users', userSchema);
