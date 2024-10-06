const Discount = require('../models/discount.model');

class DiscountController {
  async create(req, res) {
    try {
      const { code, percent, valid } = req.body;

      const createAt = new Date();

      const endDate = new Date(
        createAt.getTime() + valid * 24 * 60 * 60 * 1000
      );

      await new Discount({
        code,
        percent,
        valid,
        createAt,
        endDate,
      }).save();

      res.status(200).json({ message: 'Create discount successful' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating discount code' });
    }
  }

  async get(req, res) {
    try {
      const discounts = await Discount.find();
      return res.status(200).json(discounts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error getting all discount' });
    }
  }
}

module.exports = new DiscountController();
