const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
      },
      productName: { type: String },
      quantity: { type: Number, required: true, min: 1 },
      productImg: [{ type: String }],
      productPrice: { type: Number },
      itemTotalPrice: { type: Number },
    },
  ],
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    // required: true,
    default: 0,
  },
});

module.exports = mongoose.model('Carts', cartSchema);
