const express = require('express');
const router = express.Router();

const OrderController = require('../app/controllers/order.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/place-order', authMiddleware, OrderController.placeOrder);

module.exports = router;
