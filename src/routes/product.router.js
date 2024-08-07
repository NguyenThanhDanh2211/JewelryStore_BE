const express = require('express');
const router = express.Router();

const ProductController = require('../app/controllers/product.controller');

router.get('/get-all-product', ProductController.getAllProduct);
router.post('/add-product', ProductController.addProduct);

module.exports = router;
