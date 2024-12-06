import * as postsService from './postsService';
import { Request, Response } from 'express';

export const likePost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.handleLike(req, res, false);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error handling like:', error);
        return res.status(500).json({ message: 'An error occurred while handling the like' });
    }
};

export const checkLike = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.handleLike(req, res, true);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error checking like:', error);
        return res.status(500).json({ message: 'An error occurred while checking the like' });
    }
};

export const sharePost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.handleShare(req, res, false);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error handling share:', error);
        return res.status(500).json({ message: 'An error occurred while sharing the post' });
    }
};

export const checkShare = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.handleShare(req, res, true);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error checking share:', error);
        return res.status(500).json({ message: 'An error occurred while checking the share' });
    }
};

export const getGuestPosts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.getPosts(req, res, false);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching guest posts:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the posts' });
    }
};

export const getUserPosts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.getPosts(req, res, true);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the posts' });
    }
};

export const openPost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.openPost(req, res);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the post' });
    }
};

export const createPost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.createPost(req, res);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'An error occurred while creating the post' });
    }
};

export const editPost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.editPost(req, res);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error editing post:', error);
        return res.status(500).json({ message: 'An error occurred while updating the post' });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await postsService.deletePost(req, res);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
};
