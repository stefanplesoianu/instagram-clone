const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userRepository = require('./userRepository')
const passport = require('../passportConfig');
const { cloudinary, extractPublicId } = require('../cloudinaryConfig');

exports.getAllUsers = async (currentUser) => {
    const currentUserId = currentUser.id || 0;
    return await userRepository.getAllUsers(currentUserId);
};

exports.searchUser = async (searchTerm) => {
    if (!searchTerm || typeof searchTerm !== 'string') {
        throw new Error('Invalid search term');
    }
    return await userRepository.searchUser(searchTerm);
};

exports.getUser = async (userId) => {
    if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
    }
    return await userRepository.getUser(userId);
};

exports.register = async (data) => {
    const { email, username, password, confirmPassword, imageUrl } = data;

    if (!email || !username || !password || !confirmPassword) {
        throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    const existingUsername = await userRepository.findUserByUsername(username);
    if (existingUsername) {
        throw new Error('Username already in use');
    }

    const existingEmail = await userRepository.findUserByEmail(email);
    if (existingEmail) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultImageUrl = 'https://example.com/default-profile-pic.png';
    const userImageUrl = imageUrl || defaultImageUrl;

    return await userRepository.createUser(email, username, hashedPassword, userImageUrl);
};

exports.guestLogin = async () => {
    const guestId = crypto.randomBytes(16).toString('hex');
    const token = jwt.sign({ guestId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
};

exports.login = (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ message: info ? info.message : 'Authentication failed' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, jti: crypto.randomBytes(16).toString('hex') },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            user: { id: user.id, username: user.username },
            token
        });
    })(req, res);
};

exports.logout = async (authHeader) => {
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
        throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
        return { message: 'Token already expired' };
    }

    return await userRepository.blacklistToken(token, decoded);
};

exports.editPhoto = async (currentUser, file) => {
    const user = await userRepository.findUserById(currentUser.id);
    if (!user) {
        throw new Error('User not found');
    }

    let imageUrl = user.imageUrl;
    if (file) {
        const result = await cloudinary.uploader.upload(file.path);
        const publicId = extractPublicId(user.imageUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
        imageUrl = result.secure_url;
    }

    return await userRepository.updateUserPhoto(currentUser.id, imageUrl);
};

exports.deletePhoto = async (currentUser) => {
    const user = await userRepository.findUserById(currentUser.id);
    if (!user) {
        throw new Error('User not found');
    }

    const publicId = extractPublicId(user.imageUrl);
    if (publicId) await cloudinary.uploader.destroy(publicId);

    return await userRepository.updateUserPhoto(currentUser.id, null);
};

exports.editProfile = async (currentUser, bio) => {
    return await userRepository.updateUserBio(currentUser.id, bio);
};

exports.getFollowers = async (userId) => {
    return await userRepository.getUserFollowers(userId);
};

exports.getFollowing = async (userId) => {
    return await userRepository.getUserFollowing(userId);
};

exports.follow = async (followerId, followedId) => {
    if (followerId === followedId) {
        throw new Error('You cannot follow yourself');
    }

    const [follower, followed] = await Promise.all([
        userRepository.getUserById(followerId),
        userRepository.getUserById(followedId)
    ]);

    if (!follower || !followed) {
        throw new Error('User not found');
    }

    const existingFollow = await userRepository.getExistingFollow(followerId, followedId);
    let message;

    if (existingFollow) {
        await userRepository.unfollowUser(followerId, followedId);
        message = `You unfollowed ${followed.username}`;
    } else {
        await userRepository.followUser(followerId, followedId);
        message = `You followed ${followed.username}`;
    }

    const updatedUser = await userRepository.getUserWithFollowers(followedId);

    return {
        message,
        followersCount: updatedUser.followers.length, 
        updatedUser
    };
};
