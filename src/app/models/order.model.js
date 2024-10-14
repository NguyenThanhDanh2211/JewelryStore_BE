const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },

  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
      },
      productName: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  totalQuantity: { type: Number, default: 0 },
  disCode: { type: String },
  discount: { type: Number, default: 0 },
  paymentMethod: { type: String },
  totalPrice: { type: Number },
  finalPrice: { type: Number },
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Orders', orderSchema);
