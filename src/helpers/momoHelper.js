const crypto = require('crypto');

const generateSignature = (rawSignature, secretKey) => {
  return crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
};

module.exports = { generateSignature };
