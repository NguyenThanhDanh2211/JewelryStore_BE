const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema({
  code: { type: String, required: true },
  percent: { type: Number, required: true },
  valid: { type: Number, required: true },
  createAt: { type: Date, default: Date.now },
  endDate: { type: Date },
});

module.exports = mongoose.model('Discounts', discountSchema);
