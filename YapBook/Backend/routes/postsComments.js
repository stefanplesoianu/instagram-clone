const express = require('express');
const router = express.Router();
const { like, checkLike } = require('../controllers/likesController');
const { share, checkShare } = require('../controllers/sharesController');
const { getUserPosts, getGuestPosts, createPost, editPost, deletePost, openPost } = require('../controllers/postsController');
const { createComment, deleteComment } = require('../controllers/commentsController');
const differentiateUserOrGuest  = require('./verifyAuth');
const { upload } = require('../cloudinaryConfig');

// posts routes
router.post('/', getUserPosts);
router.post('/guestPosts', getGuestPosts);
router.post('/create', differentiateUserOrGuest, upload.single('file'), createPost);
router.get('/viewPost/:postId', differentiateUserOrGuest, openPost);
router.put('/:postId/edit', differentiateUserOrGuest, editPost);
router.delete('/:postId/delete', differentiateUserOrGuest, deletePost);
router.post('/:postId/like', differentiateUserOrGuest, like);
router.get('/:postId/like', checkLike);
router.put('/:postId/share', differentiateUserOrGuest, share);
router.get('/:postId/share', checkShare);

// comments routes
router.post('/:postId/create-comment', differentiateUserOrGuest, createComment);
router.delete('/:postId/:commentId/delete-comment', differentiateUserOrGuest, deleteComment);
router.post('/:postId/:commentId/like-comment', differentiateUserOrGuest, like);
router.get('/:postId/:commentId/like-comment', checkLike);

module.exports = router;
