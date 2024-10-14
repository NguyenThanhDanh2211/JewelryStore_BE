const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const productRouter = require('./product.router');
const cartRouter = require('./cart.route');
const discountRouter = require('./discount.route');
const orderRouter = require('./order.route');
const paymentRouter = require('./payment.route');
const cmtRouter = require('./cmt.route');

function route(app) {
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
  app.use('/product', productRouter);
  app.use('/cart', cartRouter);
  app.use('/discount', discountRouter);
  app.use('/order', orderRouter);
  app.use('/payment', paymentRouter);
  app.use('/cmt', cmtRouter);
}

module.exports = route;
