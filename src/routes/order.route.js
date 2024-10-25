const express = require('express');
const router = express.Router();

const OrderController = require('../app/controllers/order.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/place-order', authMiddleware, OrderController.placeOrder);
router.get('/get-order', authMiddleware, OrderController.getUserOrders);
router.put('/cancel/:orderId', authMiddleware, OrderController.cancelOrder);

router.get('/admin/get-all', OrderController.getAllOrders);
router.put('/admin/order-status/:orderId', OrderController.updateOrderStatus);

module.exports = router;
