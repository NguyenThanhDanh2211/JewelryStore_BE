const passport = require('passport');

class AuthController {
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

  loginFailed(req, res) {
    res.status(401).json({
      error: true,
      message: 'Log in failure!',
    });
  }
  googleAuth(req, res, next) {
    passport.authenticate('google', ['profile', 'email'])(req, res, next);
  }

  googleCallback(req, res, next) {
    passport.authenticate('google', {
      successRedirect: process.env.BASE_URL,
      failureRedirect: '/login/failed',
    })(req, res, next);
  }

  logout(req, res) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(process.env.BASE_URL);
    });
  }
}

module.exports = new AuthController();
