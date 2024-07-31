const express = require('express');
const router = express.Router();

const ProductController = require('../app/controllers/product.controller');
const { route } = require('./user.route');

router.post('/add-product', ProductController.addProduct);

module.exports = router;
