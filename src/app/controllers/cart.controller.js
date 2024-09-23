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

      // Validate input
      if (!productId || isNaN(quantityNum) || quantityNum <= 0) {
        return res
          .status(400)
          .json({ message: 'Missing or invalid product details' });
      }

      // Find the product by its ID
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Extract product details
      const productPrice = product.price;
      const productImg = product.image;
      const productName = product.name;

      // Find or create the cart for the user
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({
          userId,
          items: [],
          totalPrice: 0,
          totalQuantity: 0,
        });
      }

      // Check if the product is already in the cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        // Update the quantity for the existing product
        existingItem.quantity += quantityNum;
        existingItem.itemTotalPrice =
          existingItem.quantity * existingItem.productPrice; // Update total price for this item
      } else {
        // Add a new product to the cart
        cart.items.push({
          productId,
          quantity: quantityNum,
          productName,
          productImg,
          productPrice,
          itemTotalPrice: quantityNum * productPrice, // Calculate total price for this item
        });
      }

      // Calculate total cart price and quantity
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.itemTotalPrice;
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

  async updateCart(req, res) {
    try {
      const userId = req.user.userId;
      const { productId, quantity } = req.body;
      // console.log('productId: ', req.body.productId._id);

      const quantityNum = Number(quantity);
      if (!productId || isNaN(quantityNum) || quantityNum < 0) {
        return res.status(400).json({ message: 'Invalid product or quantity' });
      }

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Find the product in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId._id
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Update or remove the product based on the new quantity
      if (quantityNum === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantityNum;
      }

      // Recalculate the total price and total quantity of the cart
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.quantity * item.productPrice;
      }, 0);

      cart.totalQuantity = cart.items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      await cart.save();
      // console.log('Updated cart:', cart);

      return res.status(200).json({
        message: 'Cart updated successfully!',
        cart,
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteProductInCart(req, res) {
    try {
      const userId = req.user.userId;

      const { productId } = req.body;

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found!' });
      }

      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId._id
      );

      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart!' });
      }

      // Remove product form cart
      cart.items.splice(productIndex, 1);

      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.quantity * item.productPrice;
      }, 0);

      cart.totalQuantity = cart.items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      await cart.save();

      return res
        .status(200)
        .json({ message: 'Product removed from cart!', cart });
    } catch (error) {
      console.error('Error deleting product from cart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new CartController();
