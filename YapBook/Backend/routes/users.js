const express = require('express');
const router = express.Router();
const { follow } = require('../controllers/followsController');
const { searchUser, getAllUsers, editPhoto, login, logout, register, deletePhoto, editProfile, getFollowers, getFollowing, getUser, guestLogin } = require('../controllers/usersController');
const differentiateUserOrGuest = require('./verifyAuth');
const { upload } = require('../cloudinaryConfig');

router.get('/', getAllUsers);
router.get('/search', searchUser);
router.post('/register', register);
router.get('/:id', differentiateUserOrGuest, getUser);
router.get('/:id/following', differentiateUserOrGuest, getFollowing);
router.get('/:id/followers', differentiateUserOrGuest, getFollowers);
router.post('/login', login);
router.post('/guest', guestLogin);
router.put('/edit-photo', upload.single('file'), differentiateUserOrGuest, editPhoto);
router.delete('/delete-photo', differentiateUserOrGuest, deletePhoto);
router.put('/edit', differentiateUserOrGuest, editProfile);
router.post('/:id/follow', differentiateUserOrGuest, follow);
router.post('/logout', logout);

module.exports = router;
