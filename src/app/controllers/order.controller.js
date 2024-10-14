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
        orderDate: Date.now(),
        status: 'pending',
      });

      await newOrder.save();

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

  async getUserOrders(req, res) {
    try {
      const userId = req.user.userId;
      const orders = await Order.find({ userId });

      if (!orders || orders.length === 0) {
        return res.status(204).json({
          message: 'No orders found for this user. Please create a new order.',
        });
      }

      return res.status(200).json({ orders });
    } catch (error) {
      console.log('Error fetching user orders', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.userId;

      const order = await Order.findOne({ _id: orderId, userId });

      console.log(order);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.status === 'pending') {
        order.status = 'canceled';
        await order.save();

        return res.status(200).json({
          message: 'Order canceled successfully',
          order,
        });
      } else {
        return res.status(400).json({
          message: 'Cannot cancel an order that is not in Pending status',
        });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error canceling order', error });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.find();

      if (!orders.length) {
        return res.status(404).json({ message: 'No orders found.' });
      }
      return res.status(200).json({ orders });
    } catch (error) {
      console.log('Error fetching all orders for admin', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { orderId, status } = req.body;
      const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
      console.log('Error updating order status', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new OrderController();
