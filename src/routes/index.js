const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const productRouter = require('./product.router');
const cartRouter = require('./cart.route');

function route(app) {
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
  app.use('/product', productRouter);
  app.use('/cart', cartRouter);
}

module.exports = route;
