const axios = require('axios');
const { generateSignature } = require('../../helpers/momoHelper');

class PaymentController {
  async createPayment(req, res) {
    const { amount } = req.body;
    const orderInfo = 'pay with MoMo';
    const requestType = 'payWithMethod';
    const orderId = process.env.MOMO_PARTNER_CODE + new Date().getTime();
    const requestId = orderId;
    const extraData = '';

    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${process.env.MOMO_IPN_URL}&orderId=${orderId}` +
      `&orderInfo=${orderInfo}&partnerCode=${process.env.MOMO_PARTNER_CODE}&redirectUrl=${process.env.MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=${requestType}`;

    const signature = generateSignature(
      rawSignature,
      process.env.MOMO_SECRET_KEY
    );

    const requestBody = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: process.env.MOMO_REDIRECT_URL,
      ipnUrl: process.env.MOMO_IPN_URL,
      lang: 'vi',
      requestType: requestType,
      autoCapture: true,
      extraData: extraData,
      signature: signature,
    };

    try {
      const result = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      res.status(200).json(result.data);
    } catch (error) {
      console.error('Error calling MoMo API:', error);
      res.status(500).json({ message: 'Server payment error' });
    }
  }

  async handleCallback(req, res) {
    console.log('Callback: ', req.body);
    res.status(200).json(req.body);
  }

  async checkTransactionStatus(req, res) {
    const { orderId } = req.body;

    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&orderId=${orderId}&partnerCode=${process.env.MOMO_PARTNER_CODE}&requestId=${orderId}`;

    const signature = generateSignature(
      rawSignature,
      process.env.MOMO_SECRET_KEY
    );

    const requestBody = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    };

    try {
      const result = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/query',
        requestBody,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      res.status(200).json(result.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
}

module.exports = new PaymentController();
