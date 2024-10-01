const Product = require('../models/product.model');

class ProductController {
  async getAllProduct(req, res) {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error getting all product' });
    }
  }

  async getFilteredProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Extracting filters from query parameters
      const { category, tag, minPrice, maxPrice } = req.query;

      // Building the filter object based on the provided query parameters
      const filter = {};
      if (category) {
        filter.category = category; // Assuming category is a single value; use $in for multiple
      }
      if (tag) {
        filter.tag = tag; // Assuming tag is a single value; use $in for multiple
      }
      if (minPrice || maxPrice) {
        filter.price = {}; // Initialize price filter
        if (minPrice) {
          filter.price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
        }
        if (maxPrice) {
          filter.price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
        }
      }

      const totalProducts = await Product.countDocuments(filter);
      const products = await Product.find(filter).skip(skip).limit(limit);

      res.json({
        page,
        limit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        products,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  }

  // async getLimitProduct(req, res) {
  //   try {
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || 10;

  //     const skip = (page - 1) * limit;

  //     const totalProducts = await Product.countDocuments();

  //     const products = await Product.find().skip(skip).limit(limit);

  //     res.json({
  //       page,
  //       limit,
  //       totalProducts,
  //       totalPages: Math.ceil(totalProducts / limit),
  //       products,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Server Error', error });
  //   }
  // }

  async addProduct(req, res) {
    try {
      const {
        productId,
        name,
        price,
        discount,
        image,
        category,
        tag,
        description,
        gender,
        weight,
        stoneMain,
        stoneSecond,
      } = req.body;

      const existingProduct = await Product.findOne({ productId });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product already exist!' });
      }

      await new Product({
        productId,
        name,
        price,
        discount,
        image,
        category,
        tag,
        description,
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

  async show(req, res) {
    try {
      const slug = req.params.slug;

      const product = await Product.findOne({ slug });
      if (!product) {
        return res.status(404).json({ message: 'Product not found!' });
      }

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  }
}

module.exports = new ProductController();
