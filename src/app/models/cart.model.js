const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
      productImg: { type: String },
      productPrice: { type: Number },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('Carts', cartSchema);
