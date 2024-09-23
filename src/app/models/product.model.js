const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  // productId: { type: String, required: true, unique: true },
  name: { type: String },
  price: { type: Number },
  discount: { type: Number },
  image: [{ type: String }],
  category: { type: String },
  brand: { type: String },
  gender: { type: String },
  weight: { type: String },
  stoneMain: { type: String },
  stoneSecond: { type: String },
});

module.exports = mongoose.model('Products', productSchema);
