const passport = require('passport');

class AuthController {
  googleAuth(req, res, next) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(
      req,
      res,
      next
    );
  }

  googleCallback(req, res, next) {
    passport.authenticate('google', {
      successRedirect: process.env.BASE_URL,
      failureRedirect: '/auth/login/failed',
    })(req, res, next);
  }

  loginSuccess(req, res) {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: 'Successfully Logged in!',
        user: req.user,
      });
    } else {
      res.status(403).json({ error: true, message: 'Not Authorized!' });
    }
  }

  logout(req, res) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(process.env.BASE_URL);
    });
  }

  loginFailed(req, res) {
    res.status(401).json({
      error: true,
      message: 'Log in failure!',
    });
  }
}

module.exports = new AuthController();
