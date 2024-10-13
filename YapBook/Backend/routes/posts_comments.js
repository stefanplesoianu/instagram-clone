const express = require('express');
const router = express.Router();
const differentiateUserOrGuest = require('./verifyAuth');
const { upload } = require('../cloudinaryConfig');

const postsController = require('../Posts/postsController');
const commentsController = require('../Comments/commentsController');

router.post('/:postId/create-comment', differentiateUserOrGuest, commentsController.createComment);
router.delete('/:postId/:commentId/delete-comment', differentiateUserOrGuest, commentsController.deleteComment)

router.post('/', postsController.getUserPosts);
router.post('/guestPosts', postsController.getGuestPosts);
router.post('/create', differentiateUserOrGuest, upload.single('file'), postsController.createPost);
router.get('/viewPost/:postId', differentiateUserOrGuest, postsController.openPost);
router.put('/:postId/edit', differentiateUserOrGuest, postsController.editPost);
router.delete('/:postId/delete', differentiateUserOrGuest, postsController.deletePost);
router.post('/:postId/like', differentiateUserOrGuest, postsController.likePost);
router.get('/:postId/like', postsController.checkLike);
router.put('/:postId/share', differentiateUserOrGuest, postsController.sharePost);
router.get('/:postId/share', postsController.checkShare);

module.exports = router;
