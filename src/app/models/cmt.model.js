const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Products', require: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Users', require: true },
  content: { type: String, require: true },
  rating: { type: Number, min: 1, max: 5, require: true },
  createAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Comments', commentSchema);
