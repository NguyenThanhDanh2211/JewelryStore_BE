const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/auth.controller');

router.get('/login/success', AuthController.loginSuccess);
router.get('/login/failed', AuthController.loginFailed);
router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);
router.get('/logout', AuthController.logout);

module.exports = router;
