import * as commentsRepository from './commentsRepository';

export const createComment = async (userId: number, postId: number, content: string) => {
    if (!content || typeof content !== 'string' || content.trim() === '') {
        throw new Error('Invalid content, cannot create comment');
    }
    const comment = await commentsRepository.createComment(userId, postId, content);

    return comment;
};

export const deleteComment = async (commentId: number, userId: number) => {
    const comment = await commentsRepository.findCommentById(commentId);

    if (!comment) {
        throw new Error('Comment not found');
    }

    if (comment.userId !== userId) {
        throw new Error('Unauthorized to delete this comment');
    }

    await commentsRepository.deleteComment(commentId);

    return { message: 'Comment deleted successfully' };
};
