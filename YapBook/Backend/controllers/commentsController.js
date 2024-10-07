const prisma = require('../prisma/client');
const jwt = require('jsonwebtoken');

const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = parseInt(req.params.postId, 10);

        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: 'Invalid content, cannot create comment' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.id;

        if (isNaN(postId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid post ID or user ID' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                userId,
                postId
            },
            include : {
                user: true
            }
        });

        return res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Could not post comment, please try again' });
    }
};

const deleteComment = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.id;
        const commentId = parseInt(req.params.commentId, 10);

        if (isNaN(commentId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid comment ID or user ID' });
        }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        await prisma.comment.delete({ where: { id: commentId } });

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
};

module.exports = { createComment, deleteComment };