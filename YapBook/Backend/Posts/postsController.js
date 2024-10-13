const postsService = require('./postsService');

exports.likePost = async (req, res) => {
    try {
        const response = await postsService.handleLike(req, res, false);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error handling like:', error);
        return res.status(500).json({ message: 'An error occurred while handling the like' });
    }
};

exports.checkLike = async (req, res) => {
    try {
        const response = await postsService.handleLike(req, res, true);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error checking like:', error);
        return res.status(500).json({ message: 'An error occurred while checking the like' });
    }
};

exports.sharePost = async (req, res) => {
    try {
        const response = await postsService.handleShare(req, res, false);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error handling share:', error);
        return res.status(500).json({ message: 'An error occurred while sharing the post' });
    }
};

exports.checkShare = async (req, res) => {
    try {
        const response = await postsService.handleShare(req, res, true);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error checking share:', error);
        return res.status(500).json({ message: 'An error occurred while checking the share' });
    }
};

exports.getGuestPosts = async (req, res) => {
    try {
        const response = await postsService.getPosts(req, res, false);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching guest posts:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the posts' });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const response = await postsService.getPosts(req, res, true);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the posts' });
    }
};

exports.openPost = async (req, res) => {
    try {
        const response = await postsService.openPost(req, res);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the post' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const response = await postsService.createPost(req, res);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'An error occurred while creating the post' });
    }
};

exports.editPost = async (req, res) => {
    try {
        const response = await postsService.editPost(req, res);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error editing post:', error);
        return res.status(500).json({ message: 'An error occurred while updating the post' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const response = await postsService.deletePost(req, res);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
};
