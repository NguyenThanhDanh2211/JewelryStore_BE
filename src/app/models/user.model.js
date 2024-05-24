const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, minlength: 6, required: true },
  address: { type: String, required: true },
});

module.exports = mongoose.model('Users', User);
