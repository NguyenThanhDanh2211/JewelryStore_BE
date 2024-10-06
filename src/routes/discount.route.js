const express = require('express');
const router = express.Router();

const DiscountController = require('../app/controllers/discount.controller');

router.post('/create', DiscountController.create);
router.get('/get-all-discount', DiscountController.get);

module.exports = router;
