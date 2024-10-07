import api from './clientAPI';

const openPost = async (postId) => {
    try {
        const response = await api.get(`/posts/viewPost/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Could not fetch post.', error);
        throw error;
    }
};

const getUserPosts = async (followerIds) => {
    try {
        const response = await api.post('/posts', { followerIds });
        return response.data;
    } catch (error) {
        console.error('Could not fetch posts.', error);
        throw error;
    }
};

const getGuestPosts = async () => {
    try {
        const response = await api.post('/posts/guestPosts');
        return response.data;
    } catch (error) {
        console.error('Could not fetch guest posts.', error);
        throw error;
    }
};

const createPost = async (content, file) => {
    try {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('file', file);

        const response = await api.post('/posts/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data;
    } catch (error) {
        console.error('Could not create post.', error);
        throw error;
    }
};

const editPost = async (postId, content) => {
    try {
        const formData = new FormData();
        formData.append('content', content);

        const response = await api.put(`/posts/${postId}/edit`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data;
    } catch (error) {
        console.error('Could not edit post.', error);
        throw error;
    }
};

const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/posts/${postId}/delete`);
        return response.data;
    } catch (error) {
        console.error('Could not delete post.', error);
        throw error;
    }
};

const likePost = async (postId) => {
    try {
        const response = await api.post(`/posts/${parseInt(postId, 10)}/like`, { id: postId, isComment: false });
        return response.data;
    } catch (error) {
        console.error('Could not like post.', error);
        throw error;
    }
};

const checkShare = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}/share`);
        return response.data;
    } catch (error) {
        console.error('Could not check share status.', error);
        throw error;
    }
};

const sharePost = async (postId) => {
    try {
        const response = await api.put(`/posts/${postId}/share`);
        return response.data;
    } catch (error) {
        console.error('Could not share post.', error);
        throw error;
    }
};

const checkPostLike = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Could not check post like status.', error);
        throw error;
    }
};

export {
    openPost,
    getUserPosts,
    getGuestPosts,
    createPost,
    editPost,
    deletePost,
    likePost,
    checkShare,
    sharePost,
    checkPostLike
};