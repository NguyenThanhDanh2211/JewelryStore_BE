const userRouter = require('./user.route');
const authRouter = require('./auth.route');

function route(app) {
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
}

module.exports = route;
