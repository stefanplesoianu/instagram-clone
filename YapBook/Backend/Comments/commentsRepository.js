const prisma = require('../prisma/client');
// Create Comment (Repository)
exports.createComment = async (userId, postId, content) => {
    // Create a new comment and include the user data
    return await prisma.comment.create({
        data: {
            content,
            userId,
            postId
        },
        include: {
            user: true // Include the user details like in the old implementation
        }
    });
};

// Find Comment by ID (Repository)
exports.findCommentById = async (commentId) => {
    // Find the comment by its ID (no changes here)
    return await prisma.comment.findUnique({
        where: { id: commentId }
    });
};

// Delete Comment (Repository)
exports.deleteComment = async (commentId) => {
    // Delete the comment by its ID (no changes here)
    return await prisma.comment.delete({
        where: { id: commentId }
    });
};
