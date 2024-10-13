const commentsService = require('./commentsService');

// Create Comment (Controller)
exports.createComment = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const postId = parseInt(req.params.postId, 10);
        const { content } = req.body;
        const userId = req.user.id;

        if (isNaN(postId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid post ID or user ID' });
        }

        // Pass userId, postId, and content to the service layer
        const comment = await commentsService.createComment(userId, postId, content);

        // Return the created comment (includes user details like in the old model)
        return res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Could not post comment, please try again' });
    }
};

// Delete Comment (Controller)
exports.deleteComment = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const commentId = parseInt(req.params.commentId, 10);
        const userId = req.user.id;

        if (isNaN(commentId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid comment ID or user ID' });
        }

        // Pass commentId and userId to the service layer
        const result = await commentsService.deleteComment(commentId, userId);

        // Return the message after successful deletion
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
};
