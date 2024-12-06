import { Request, Response } from 'express';
import * as userService from './userService';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await userService.getAllUsers(req.user as any);
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

export const searchUser = async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.searchTerm as string;
        const users = await userService.searchUser(searchTerm);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await userService.getUser(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, could not get user' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.register(req.body);
        res.status(200).json({ message: 'Registered successfully, please log in', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, could not create user' });
    }
};

export const guestLogin = async (req: Request, res: Response) => {
    try {
        const token = await userService.guestLogin();
        res.status(200).json({ message: 'Guest login successful', token });
    } catch (error) {
        res.status(500).send('Something went wrong, try again');
    }
};

export const login = async (req: Request, res: Response) => {
    userService.login(req, res);
};

export const logout = async (req: Request, res: Response) => {
    try {
        await userService.logout(req.headers.authorization as string);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, error' });
    }
};

export const editPhoto = async (req: Request, res: Response) => {
    try {
        const updatedProfile = await userService.editPhoto(req.user as any, req.file);
        res.status(200).json({ message: 'Profile updated', user: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

export const deletePhoto = async (req: Request, res: Response) => {
    try {
        await userService.deletePhoto(req.user as any);
        res.status(200).json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

export const editProfile = async (req: Request, res: Response) => {
    try {
        const updatedProfile = await userService.editProfile(req.user as any, req.body.bio);
        res.status(200).json({ message: 'Profile updated', user: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

export const getFollowers = async (req: Request, res: Response) => {
    try {
        const followers = await userService.getFollowers(parseInt(req.params.id, 10));
        res.status(200).json({ followers });
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

export const getFollowing = async (req: Request, res: Response) => {
    try {
        const following = await userService.getFollowing(parseInt(req.params.id, 10));
        res.status(200).json({ following });
    } catch (error) {
        console.error('Error getting following:', error);
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};

export const follow = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const followerId = (req.user as any).id;
        const followedId = parseInt(req.params.id, 10);

        if (isNaN(followedId) || isNaN(followerId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const result = await userService.follow(followerId, followedId);
        return res.status(200).json(result); 
    } catch (error) {
        console.error('Error following/unfollowing user:', error);
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
};
