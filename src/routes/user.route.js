const express = require('express');
const router = express.Router();

const UserController = require('../app/controllers/user.controller');

router.post('/signup', UserController.signup);
router.post('/update/:id', UserController.updateProfile);

module.exports = router;
