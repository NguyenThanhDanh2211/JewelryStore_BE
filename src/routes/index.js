const userRouter = require('./user.route');
const authRouter = require('./auth.route');
const productRouter = require('./product.router');

function route(app) {
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
  app.use('/product', productRouter);
}

module.exports = route;
