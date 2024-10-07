const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('../passportConfig')
const { cloudinary, upload, extractPublicId } = require('../cloudinaryConfig');

const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id || 0;
        const allUsers = await prisma.user.findMany({
            where: { id: { not: currentUserId } },
            select: { id: true, username: true }
        });
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

const searchUser = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        if (!searchTerm || typeof searchTerm !== 'string') {
            return res.status(400).json({ message: 'Invalid search term' });
        }
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error during user search:', error);
        return res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

// getUser to render user's profiles

const getUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!userId || isNaN(userId)) {
            return res.status(404).json({ message: 'Missing or invalid user ID' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                followers: true,
                following: true,
                posts: true,
                shares: true
            }
        });
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        return res.status(500).send('Internal server error, could not get user');
    }
};

const register = async (req, res) => {
    const { email, username, password, confirmPassword, imageUrl } = req.body;

    if (!email || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields required to register' });
    }

    if (password !== confirmPassword) {
        return res.status(401).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already in use' });
        }
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        //all users receive a default profile pic upon account creation. they can edit it later

        const defaultImageUrl = 'https://res.cloudinary.com/djdyyplbz/image/upload/c_thumb,w_200,g_face/v1725560627/abstract-user-flat-4_zhkrvp.svg';
        const userImageUrl = imageUrl || defaultImageUrl;
        const newUser = await prisma.user.create({
            data: { 
                email, 
                username, 
                password: hashedPassword,
                imageUrl: userImageUrl
            }
        });

        //needed to return explicit success message, otherwise registration failed
        return res.status(200).json({ message: 'Registered successfully, please log in', success: true, user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error, could not create user' });
    }  
};

const guestLogin = async (req, res) => {
    try {
      //creating a random guest ID 
      const guestId = crypto.randomBytes(16).toString('hex')
      const token = jwt.sign({ guestId }, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.status(200).json({ message: 'Guest login successful', token });
    } catch (error) {
      console.error('Error during guest login:', error);
      return res.status(500).send('Something went wrong, try again');
    }
  };

const login = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Authentication failed',
        user: null
      });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, jti: crypto.randomBytes(16).toString('hex') },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
      },
      token
    });

  })(req, res)
};

const logout = async (req, res) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //get time in seconds

        const now = Date.now() / 1000 

        if (decoded.exp < now) {
            return res.status(200).json({ message: 'Token already expired' });
        }

        await prisma.blacklistToken.create({
            data: {
                token: token,
                expiryDate: new Date(decoded.exp * 1000), 
                userId: decoded.id || null,
                guestId: decoded.guestId || null
            }
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

const deletePhoto = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.id
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.imageUrl) {
            const publicId = extractPublicId(user.imageUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await prisma.user.update({
            where: { id: userId },
            data: { imageUrl: null }
        });

        return res.status(200).json({ message: 'Image deleted' });
    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

const editPhoto = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.id

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Could not find user' });
        }

        let imageUrl = user.imageUrl;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'YapBookPosts',
                allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'webp']
            });

            // removing old image
            const publicId = extractPublicId(user.imageUrl);
            if (publicId) await cloudinary.uploader.destroy(publicId);

            imageUrl = result.secure_url
        }

        const updatedProfile = await prisma.user.update({
            where: { id: userId },
            data: { imageUrl }
        });

        return res.status(200).json({ message: 'Profile updated', user: updatedProfile });
    } catch (error) {
        console.error('Error updating photo:', error);
        return res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

// bio and profile image are updated separately for convenience

const editProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.id
        const { bio } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Could not find user' });
        }
        const editedProfile = await prisma.user.update({
            where: { id: userId },
            data: { bio }
        });
        return res.status(200).json({ message: 'Profile updated', user: editedProfile });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

// separate function to get a follower's users to display on the user's profile page
// easire to get a separate function for this as React struggled to unpack info otherwise

const getFollowers = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const followers = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                followers: {
                    include: { follower: true }
                }
            }
        });
        return res.status(200).json({ followers: followers.followers.map(f => f.follower) });
    } catch (error) {
        console.error('Error getting followers:', error);
        return res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

//same logic as above

const getFollowing = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const following = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                following: {
                    include: { user: true }
                }
            }
        });
        return res.status(200).json({ following: following.following.map(f => f.user) });
    } catch (error) {
        console.error('Error getting following:', error);
        return res.status(500).json({ message: 'Something went wrong, try again' });
    }
};


module.exports = {
    searchUser,
    getUser,
    register,
    login,
    logout,
    deletePhoto,
    editProfile,
    getFollowers,
    getFollowing,
    guestLogin,
    editPhoto,
    getAllUsers,
};
