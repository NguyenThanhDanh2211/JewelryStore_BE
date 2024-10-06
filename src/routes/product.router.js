const express = require('express');
const router = express.Router();

const ProductController = require('../app/controllers/product.controller');
const multerMiddleware = require('../middleware/multerMiddleware');

router.get('/get-all-products', ProductController.getAllProduct);
router.get('/get-filtered-products', ProductController.getFilteredProducts);
router.post('/add-product', multerMiddleware, ProductController.addProduct);
router.get('/search', ProductController.search);
router.get('/:slug', ProductController.show);

module.exports = router;
