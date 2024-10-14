const express = require('express');
const router = express.Router();

const CommentController = require('../app/controllers/cmt.controller');
const AuthMiddleware = require('../middleware/authMiddleware');

router.post('/:productId/comments', AuthMiddleware, CommentController.postCmt);
router.get('/:productId/comments', CommentController.getCmt);

module.exports = router;
