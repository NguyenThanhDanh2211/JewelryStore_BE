const Product = require('../models/product.model');

const { uploadImage } = require('../../utils/cloudinary');

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

      const { category, tag, minPrice, maxPrice } = req.query;

      const filter = {};
      if (category) {
        filter.category = category;
      }
      if (tag) {
        filter.tag = tag;
      }
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
          filter.price.$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          filter.price.$lte = parseFloat(maxPrice);
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

  ////////////// 1 anh
  // async addProduct(req, res) {
  //   try {
  //     const {
  //       productId,
  //       name,
  //       price,
  //       discount,
  //       category,
  //       tag,
  //       description,
  //       gender,
  //       weight,
  //       stoneMain,
  //       stoneSecond,
  //     } = req.body;

  //     const existingProduct = await Product.findOne({ productId });
  //     if (existingProduct) {
  //       return res.status(400).json({ message: 'Product already exists!' });
  //     }

  //     const imageUrl = await uploadImage(req);

  //     const newProduct = new Product({
  //       productId,
  //       name,
  //       price,
  //       discount,
  //       image: imageUrl,
  //       category,
  //       tag,
  //       description,
  //       gender,
  //       weight,
  //       stoneMain,
  //       stoneSecond,
  //     });

  //     await newProduct.save();
  //     return res.status(201).send('Product added successfully!');
  //   } catch (error) {
  //     console.log('Error:', error);
  //     return res.status(500).json({ message: 'Error adding product' });
  //   }
  // }
  //////////////

  ///////////////////////////

  async addProduct(req, res) {
    try {
      const {
        productId,
        name,
        price,
        discount,
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
        return res.status(400).json({ message: 'Product already exists!' });
      }

      const imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const imageUrl = await uploadImage(file.path);
          return imageUrl;
        })
      );

      const newProduct = new Product({
        productId,
        name,
        price,
        discount,
        image: imageUrls,
        category,
        tag,
        description,
        gender,
        weight,
        stoneMain,
        stoneSecond,
      });

      await newProduct.save();
      return res.status(201).send('Product added successfully!');
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json({ message: 'Error adding product' });
    }
  }

  async show(req, res) {
    try {
      const slug = req.params.slug;

      const product = await Product.findOne({ slug });
      if (!product) {
        return res.status(404).json({ message: 'Product not found!-SHOW' });
      }

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  }

  async search(req, res) {
    try {
      const { q, type = 'less' } = req.query;

      const searchTerm = q ? q.trim() : '';
      if (!searchTerm) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      let searchConditions;
      if (type === 'strict') {
        searchConditions = {
          $or: [
            { name: searchTerm },
            { tag: searchTerm },
            { category: searchTerm },
          ],
        };
      } else {
        const regex = new RegExp(searchTerm.split(' ').join('|'), 'i');
        searchConditions = {
          $or: [{ name: regex }, { tag: regex }, { category: regex }],
        };
      }

      const products = await Product.find(searchConditions);

      // if (products.length === 0) {
      //   return res.status(404).json({ message: 'Product not found' });
      // }
      return res.status(200).json(products);
    } catch (error) {
      console.log('Error searching products: ', error);
      return res
        .status(500)
        .json({ message: 'Error searching products', error });
    }
  }
}

module.exports = new ProductController();
