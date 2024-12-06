const express = require('express');
const router = express.Router();
const differentiateUserOrGuest = require('./verifyAuth');
const { upload } = require('../cloudinaryConfig');

const userController = require('../Users/userController');

router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUser);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/guest', userController.guestLogin);
router.put('/edit-photo', differentiateUserOrGuest, upload.single('file'), userController.editPhoto);
router.delete('/delete-photo', differentiateUserOrGuest, userController.deletePhoto);
router.put('/edit', differentiateUserOrGuest, userController.editProfile);
router.post('/:id/follow', differentiateUserOrGuest, userController.follow);
router.get('/:id', differentiateUserOrGuest, userController.getUser);
router.get('/:id/following', differentiateUserOrGuest, userController.getFollowing);
router.get('/:id/followers', differentiateUserOrGuest, userController.getFollowers);
router.post('/logout', userController.logout);

module.exports = router;
