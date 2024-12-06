import api from './clientAPI';

const createComment = async (content, postId) => {
    try {
        const response = await api.post(`/posts/${postId}/create-comment`, { content });
        return response.data;
    } catch (error) {
        console.error('Could not create comment.', error);
        throw error;
    }
};

const deleteComment = async (postId, commentId) => {
    try {
        const response = await api.delete(`/posts/${postId}/${commentId}/delete-comment`);
        return response.data;
    } catch (error) {
        console.error('Could not delete comment.', error);
        throw error;
    }
};

const likeComment = async (commentId) => {
    try {
        const response = await api.post(`/comments/${parseInt(commentId, 10)}/like`, { id: commentId, isComment: true });
        return response.data;
    } catch (error) {
        console.error('Could not like comment.', error);
        throw error;
    }
};

const checkCommentLike = async (postId, commentId) => {
    try {
        const response = await api.get(`/posts/${postId}/${commentId}/like-comment`);
        return response.data;
    } catch (error) {
        console.error('Could not check comment like status.', error);
        throw error;
    }
};

export {
    createComment,
    deleteComment,
    likeComment,
    checkCommentLike
};