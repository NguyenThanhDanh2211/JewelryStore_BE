// const express = require('express');
// const router = express.Router();
// const AuthController = require('../app/controllers/auth.controller');

// router.get('/login/success', (req, res) =>
//   AuthController.loginSuccess(req, res)
// );
// router.get('/login/failed', (req, res) => AuthController.loginFailed(req, res));
// router.get('/google', (req, res, next) =>
//   AuthController.googleAuth(req, res, next)
// );
// router.get('/google/callback', (req, res, next) =>
//   AuthController.googleCallback(req, res, next)
// );
// router.get('/logout', (req, res) => AuthController.logout(req, res));

// module.exports = router;

const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/auth.controller');

router.get('/login/success', AuthController.loginSuccess);
router.get('/login/failed', AuthController.loginFailed);
router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);
router.get('/logout', AuthController.logout);

module.exports = router;
