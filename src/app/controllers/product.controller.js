const Product = require('../models/product.model');

class ProductController {
  async addProduct(req, res) {
    try {
      const {
        idProduct,
        name,
        price,
        discount,
        image,
        category,
        brand,
        gender,
        weight,
        stoneMain,
        stoneSecond,
      } = req.body;

      const existingProduct = await Product.findOne({ idProduct });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product already exist!' });
      }

      await new Product({
        idProduct,
        name,
        price,
        discount,
        image,
        category,
        brand,
        gender,
        weight,
        stoneMain,
        stoneSecond,
      }).save();

      res.status(201).send('Product added successfully!');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error adding product' });
    }
  }
}

module.exports = new ProductController();
