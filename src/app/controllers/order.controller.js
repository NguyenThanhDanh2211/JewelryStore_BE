const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Discount = require('../models/discount.model');

class OrderController {
  async placeOrder(req, res) {
    try {
      const userId = req.user.userId;
      let cart = await Cart.findOne({ userId });
      const { customer, paymentMethod, disCode } = req.body;

      const discountData = await Discount.findOne({ code: disCode });

      const items = cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.itemTotalPrice,
      }));

      const totalQuantity = cart.totalQuantity;
      const totalPrice = cart.totalPrice;
      const discountPercent = discountData ? discountData.percent : 0;

      const finalPrice = totalPrice - (totalPrice * discountPercent) / 100;

      const newOrder = new Order({
        userId: userId,
        customer: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        },

        items: items,
        totalQuantity: totalQuantity,
        disCode,
        discount: discountPercent,
        paymentMethod,
        totalPrice: totalPrice,
        finalPrice: finalPrice,
      });

      // Save the order to the database
      await newOrder.save();

      // Send success response
      return res
        .status(200)
        .json({ message: 'Place order successful', order: newOrder });
    } catch (error) {
      console.log('Error placing order', error);
      return res
        .status(500)
        .json({ message: 'Internal server error - ERROR PLACE ORDER', error });
    }
  }
}

module.exports = new OrderController();
