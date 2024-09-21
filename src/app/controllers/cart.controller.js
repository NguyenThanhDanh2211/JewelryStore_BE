const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartController {
  async getAllCart(req, res) {
    try {
      const userId = req.user.userId;

      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart) {
        return res.status(400).json({ message: 'Cart not found' });
      }

      return res.status(200).json(cart);
    } catch (error) {
      console.log('Error retrieving cart: ', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async addToCart(req, res) {
    try {
      const userId = req.user.userId;
      const { productId, quantity } = req.body;

      const quantityNum = Number(quantity);

      if (!productId || isNaN(quantityNum) || quantity <= 0) {
        return res
          .status(400)
          .json({ message: 'Missing or invalid product details' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const productPrice = product.price;
      const productImg = product.img;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({
          userId,
          items: [],
          totalPrice: 0,
          totalQuantity: 0,
        });
      }

      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantityNum;
      } else {
        cart.items.push({
          productId,
          quantity: quantityNum,
          productImg,
          productPrice,
        });
      }

      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.quantity * item.productPrice;
      }, 0);

      cart.totalQuantity = cart.items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      await cart.save();

      return res.status(200).json({
        message: 'Product added to cart successfully!',
        cart,
      });
    } catch (error) {
      console.log('Error retrieving cart: ', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new CartController();
