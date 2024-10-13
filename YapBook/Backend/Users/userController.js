const userService = require('./userService');

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await userService.getAllUsers(req.user);
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

exports.searchUser = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        const users = await userService.searchUser(searchTerm);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await userService.getUser(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, could not get user' });
    }
};

exports.register = async (req, res) => {
    try {
        const newUser = await userService.register(req.body);
        res.status(200).json({ message: 'Registered successfully, please log in', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, could not create user' });
    }
};

exports.guestLogin = async (req, res) => {
    try {
        const token = await userService.guestLogin();
        res.status(200).json({ message: 'Guest login successful', token });
    } catch (error) {
        res.status(500).send('Something went wrong, try again');
    }
};

exports.login = async(req, res) => {
    userService.login(req, res);
};

exports.logout = async (req, res) => {
    try {
        await userService.logout(req.headers.authorization);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, error' });
    }
};

exports.editPhoto = async (req, res) => {
    try {
        const updatedProfile = await userService.editPhoto(req.user, req.file);
        res.status(200).json({ message: 'Profile updated', user: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        await userService.deletePhoto(req.user);
        res.status(200).json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

exports.editProfile = async (req, res) => {
    try {
        const updatedProfile = await userService.editProfile(req.user, req.body.bio);
        res.status(200).json({ message: 'Profile updated', user: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const followers = await userService.getFollowers(parseInt(req.params.id));
        res.status(200).json({ followers });
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const following = await userService.getFollowing(parseInt(req.params.id));
        res.status(200).json({ following });
    } catch (error) {
        console.error('Error getting following:', error);
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

exports.follow = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const followerId = req.user.id;
        const followedId = parseInt(req.params.id, 10);

        if (isNaN(followedId) || isNaN(followerId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const result = await userService.follow(followerId, followedId);
        return res.status(200).json(result); 
    } catch (error) {
        console.error('Error following/unfollowing user:', error);
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};
