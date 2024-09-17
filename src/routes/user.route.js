const express = require('express');
const router = express.Router();

const UserController = require('../app/controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, UserController.aboutMe);
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/update/:id', UserController.updateProfile);

module.exports = router;
