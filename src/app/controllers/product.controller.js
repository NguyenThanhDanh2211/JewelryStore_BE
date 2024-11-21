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

  async getProductDiscounted(req, res) {
    try {
      const discountedProducts = await Product.find({
        discount: { $gt: 0 },
      }).limit(10);
      res.status(200).json(discountedProducts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error getting discounted products' });
    }
  }

  async getFilteredProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const { category } = req.params;
      const { collect, tag, men, minPrice, maxPrice, sort } = req.query;

      const filter = {};

      if (men !== undefined) {
        filter.men = men === 'true';
      }

      if (category && category !== 'men-jewelry') {
        filter.category = new RegExp(`^${category}$`, 'i');
      }

      if (collect) {
        filter.collect = collect;
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

      let sortOption = {};
      if (sort) {
        switch (sort) {
          case 'Price: Low to High':
            sortOption.price = 1;
            break;
          case 'Price: High to Low':
            sortOption.price = -1;
            break;
          case 'Newest Arrivals':
            sortOption._id = -1;
            break;
          default:
            break;
        }
      }

      const totalProducts = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

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

  async addProduct(req, res) {
    try {
      const {
        productId,
        name,
        price,
        discount,
        category,
        collect,
        tag,
        description,
        detail,
      } = req.body;

      const men =
        req.body.men === 'true' || req.body.men === true ? true : false;

      const existingProduct = await Product.findOne({ productId });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product already exists!' });
      }

      let finalPrice = price;
      if (discount && discount > 0) {
        finalPrice = price - price * (discount / 100);
      }

      const imageUrls = await Promise.all(
        req.files.map(async (file) => {
          try {
            const imageUrl = await uploadImage(file.path);
            return imageUrl;
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Image upload failed');
          }
        })
      );

      const newProduct = new Product({
        productId,
        name,
        price,
        discount,
        finalPrice,
        image: imageUrls,
        category,
        men,
        collect,
        tag,
        description,
        detail,
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

  async updateProduct(req, res) {
    try {
      const { slug } = req.params;
      const {
        name,
        price,
        discount,
        category,
        collect,
        tag,
        description,
        detail,
        men,
      } = req.body;

      const product = await Product.findOne({ slug });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (name) product.name = name;
      if (price) product.price = price;
      if (discount !== undefined && discount >= 0) product.discount = discount;
      if (category) product.category = category;
      if (collect) product.collect = collect;
      if (tag) product.tag = tag;
      if (description) product.description = description;
      if (detail) product.detail = detail;
      if (men !== undefined) product.men = men;

      if (discount && discount > 0) {
        product.finalPrice = price - price * (discount / 100);
      } else {
        product.finalPrice = price;
      }

      if (req.files && req.files.length > 0) {
        const imageUrls = await Promise.all(
          req.files.map(async (file) => {
            try {
              const imageUrl = await uploadImage(file.path);
              return imageUrl;
            } catch (uploadError) {
              console.error('Error uploading image:', uploadError);
              throw new Error('Image upload failed');
            }
          })
        );
        product.image = imageUrls;
      }

      await product.save();

      return res
        .status(200)
        .json({ message: 'Product updated successfully!', product });
    } catch (error) {
      console.log('Error updating product: ', error);
      return res.status(500).json({ message: 'Error updating product', error });
    }
  }
}

module.exports = new ProductController();
