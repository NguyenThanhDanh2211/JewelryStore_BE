const express = require('express');
const router = express.Router();

const PaymentController = require('../app/controllers/payment.controller');

router.post('/', PaymentController.createPayment);
router.post('/transaction-status', PaymentController.checkTransactionStatus);
router.post('/callback', PaymentController.handleCallback);

module.exports = router;
