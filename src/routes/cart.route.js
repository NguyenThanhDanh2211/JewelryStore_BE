const express = require('express');
const router = express.Router();

const CartController = require('../app/controllers/cart.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-all', authMiddleware, CartController.getAllCart);
router.post('/add', authMiddleware, CartController.addToCart);

module.exports = router;
