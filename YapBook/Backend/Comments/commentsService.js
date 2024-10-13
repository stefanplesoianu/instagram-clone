const commentsRepository = require('./commentsRepository');

// Create Comment (Service)
exports.createComment = async (userId, postId, content) => {
    // Validate comment content (same as old logic)
    if (!content || typeof content !== 'string' || content.trim() === '') {
        throw new Error('Invalid content, cannot create comment');
    }

    // Call the repository to create the comment
    const comment = await commentsRepository.createComment(userId, postId, content);

    // Return the created comment (includes user data, as needed by the frontend)
    return comment;
};

// Delete Comment (Service)
exports.deleteComment = async (commentId, userId) => {
    // Fetch the comment to validate its existence and ownership
    const comment = await commentsRepository.findCommentById(commentId);

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.userId !== userId) {
        throw new Error('Unauthorized to delete this comment');
    }

    // Delete the comment
    await commentsRepository.deleteComment(commentId);

    // Return a success message
    return { message: 'Comment deleted successfully' };
};
