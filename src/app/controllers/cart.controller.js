const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartController {
  async getAllCart(req, res) {
    try {
      const userId = req.user.userId;

      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(200).json({ message: 'Cart is empty', items: [] });
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

      if (!productId || isNaN(quantityNum) || quantityNum <= 0) {
        return res
          .status(400)
          .json({ message: 'Missing or invalid product details' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const finalPrice = product.finalPrice || product.price;
      const productImg = product.image;
      const productName = product.name;
      const slug = product.slug;
      const category = product.category;

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
        (item) => item.productId.toString() === productId._id
      );

      if (existingItem) {
        existingItem.quantity += quantityNum;
        existingItem.itemTotalPrice = existingItem.quantity * finalPrice;
      } else {
        cart.items.push({
          productId: productId,
          quantity: quantityNum,
          productName,
          slug,
          category,
          productImg,
          productPrice: finalPrice, // Giá áp dụng
          itemTotalPrice: quantityNum * finalPrice, // Tổng giá sản phẩm
        });
      }

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
        // Calculate the total price for this item
        cart.items[itemIndex].itemTotalPrice =
          quantityNum * cart.items[itemIndex].productPrice;
      }

      // Recalculate the total price and total quantity of the cart
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.itemTotalPrice;
      }, 0);

      cart.totalQuantity = cart.items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);

      await cart.save();

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

  async deleteAll(req, res) {
    const userId = req.user.userId;

    try {
      await Cart.deleteMany({ userId });

      return res.status(200).json({ message: 'All products removed.' });
    } catch (error) {
      console.log('Error deleting all products', error);
      return res
        .status(500)
        .json({ message: 'Error deleting all products', error });
    }
  }
}

module.exports = new CartController();
