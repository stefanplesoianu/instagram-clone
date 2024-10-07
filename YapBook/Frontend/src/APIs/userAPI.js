import api from './clientAPI';
import { setToken, getToken, clearToken, setGuestToken, getGuestToken, clearGuestToken } from '../utils/tokenManager';

const searchUser = async (searchTerm) => {
    try {
        const response = await api.get('/users/search', {
            params: { searchTerm }
        });
        return response.data;
    } catch (error) {
        console.error('No users found.', error);
        throw error;
    }
};

const guestLogin = async () => {
    try {
        const response = await api.post('/users/guest');
        const { token } = response.data.token;

        setGuestToken(token);

        return response.data;
    } catch (error) {
        console.error('Failed to login as guest:', error);
        throw error;
    }
};

const userLogin = async (username, password) => {
    try {
        const response = await api.post('/users/login', { username, password });
        return response.data
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

const getProfile = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Could not fetch user.', error);
        throw error;
    }
};

const register = async (email, username, password, confirmPassword) => {
    try {
        const response = await api.post('/users/register', { email, username, password, confirmPassword });
        return response.data;
    } catch (error) {
        console.error('Could not register user.', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

const logout = async () => {
    try {
        const token = getToken();
        const guestToken = getGuestToken();

        let response;

        if (token) {
            response = await api.post('/users/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            clearToken();
        } else if (guestToken) {
            response = await api.post('/users/logout', {}, {
                headers: { Authorization: `Bearer ${guestToken}` }
            });
            clearGuestToken();
        } else {
            throw new Error('No token or guest token found');
        }
        return response.data;
    } catch (error) {
        console.error('Could not logout.', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Could not fetch users.', error);
        throw error;
    }
};

const deletePhoto = async () => {
    try {
        const response = await api.delete('/users/delete-photo');
        return response.data;
    } catch (error) {
        console.error('Could not delete photo.', error);
        throw error;
    }
};

const editPhoto = async (formData) => {
    try {
        const response = await api.put('/users/edit-photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile photo:', error);
        throw error;
    }
};


const editProfile = async (data) => {
    try {
        const response = await api.put('/users/edit', data); // Send bio as JSON
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

const getFollowers = async (id) => {
    try {
        const response = await api.get(`/users/${id}/followers`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving followers.', error);
        throw error;
    }
};

const getFollowing = async (id) => {
    try {
        const response = await api.get(`/users/${id}/following`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving followed users.', error);
        throw error;
    }
};

const followUser = async (followedId) => {
    try {
        const response = await api.post(`/users/${followedId}/follow`);
        return response.data;
    } catch (error) {
        console.error('Could not follow user.', error);
        throw error;
    }
};

export {
    searchUser,
    userLogin,
    guestLogin,
    getProfile,
    register,
    logout,
    deletePhoto,
    editProfile,
    getFollowers,
    getFollowing,
    followUser,
    editPhoto,
    getAllUsers
};