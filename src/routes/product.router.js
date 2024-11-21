const express = require('express');
const router = express.Router();

const ProductController = require('../app/controllers/product.controller');
const multerMiddleware = require('../middleware/multerMiddleware');

router.get('/get-all-products', ProductController.getAllProduct);
router.get(
  '/get-filtered-products/:category?',
  ProductController.getFilteredProducts
);
// router.get('/get/:category', ProductController.getProductByCategory);
router.get('/discounted', ProductController.getProductDiscounted);

router.post('/add-product', multerMiddleware, ProductController.addProduct);
router.get('/search', ProductController.search);
router.get('/:category/:slug', ProductController.show);
router.get('/:slug', ProductController.show);
router.put('/products/:slug', ProductController.updateProduct);

module.exports = router;
