import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as userRepository from './userRepository';
import passport from '../passportConfig';
import { cloudinary, extractPublicId } from '../cloudinaryConfig';
import { Request, Response } from 'express';

export const getAllUsers = async (currentUser: { id: number }) => {
    const currentUserId = currentUser.id || 0;
    return await userRepository.getAllUsers(currentUserId);
};

export const searchUser = async (searchTerm: string) => {
    if (!searchTerm || typeof searchTerm !== 'string') {
        throw new Error('Invalid search term');
    }
    return await userRepository.searchUser(searchTerm);
};

export const getUser = async (userId: number) => {
    if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
    }
    return await userRepository.getUser(userId);
};

export const register = async (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    imageUrl?: string;
}) => {
    const { email, username, password, confirmPassword, imageUrl } = data;

    if (!email || !username || !password || !confirmPassword) {
        throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    const existingUsername = await userRepository.findUserByUsername(username);
    if (existingUsername) {
        throw new Error('Username already in use');
    }

    const existingEmail = await userRepository.findUserByEmail(email);
    if (existingEmail) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultImageUrl = 'https://res.cloudinary.com/djdyyplbz/image/upload/v1729508109/abstract-user-flat-4_fkxupb.png';
    const userImageUrl = imageUrl || defaultImageUrl;

    return await userRepository.createUser(email, username, hashedPassword, userImageUrl);
};

export const guestLogin = async () => {
    const guestId = crypto.randomBytes(16).toString('hex');
    const token = jwt.sign({ guestId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    return token;
};

export const login = (req: Request, res: Response) => {
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
        if (err || !user) {
            return res.status(400).json({ message: info ? info.message : 'Authentication failed' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, jti: crypto.randomBytes(16).toString('hex') },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            user: { id: user.id, username: user.username },
            token
        });
    })(req, res);
};

export const logout = async (authHeader: string | undefined) => {
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
        throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const now = Date.now() / 1000;

    if ((decoded as any).exp < now) {
        return { message: 'Token already expired' };
    }

    return await userRepository.blacklistToken(token, decoded);
};

export const editPhoto = async (currentUser: { id: number }, file: any) => {
    const user = await userRepository.findUserById(currentUser.id);
    if (!user) {
        throw new Error('User not found');
    }

    let imageUrl = user.imageUrl;
    if (file) {
        const result = await cloudinary.uploader.upload(file.path);
        const publicId = extractPublicId(user.imageUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
        imageUrl = result.secure_url;
    }

    return await userRepository.updateUserPhoto(currentUser.id, (imageUrl as any));
};

export const deletePhoto = async (currentUser: { id: number }) => {
    const user = await userRepository.findUserById(currentUser.id);
    if (!user) {
        throw new Error('User not found');
    }

    const publicId = extractPublicId(user.imageUrl);
    if (publicId) await cloudinary.uploader.destroy(publicId);

    return await userRepository.updateUserPhoto(currentUser.id, (null as any));
};

export const editProfile = async (currentUser: { id: number }, bio: string) => {
    return await userRepository.updateUserBio(currentUser.id, bio);
};

export const getFollowers = async (userId: number) => {
    return await userRepository.getUserFollowers(userId);
};

export const getFollowing = async (userId: number) => {
    return await userRepository.getUserFollowing(userId);
};

export const follow = async (followerId: number, followedId: number) => {
    if (followerId === followedId) {
        throw new Error('You cannot follow yourself');
    }

    const [follower, followed] = await Promise.all([
        userRepository.getUserById(followerId),
        userRepository.getUserById(followedId)
    ]);

    if (!follower || !followed) {
        throw new Error('User not found');
    }

    const existingFollow = await userRepository.getExistingFollow(followerId, followedId);
    let message;

    if (existingFollow) {
        await userRepository.unfollowUser(followerId, followedId);
        message = `You unfollowed ${followed.username}`;
    } else {
        await userRepository.followUser(followerId, followedId);
        message = `You followed ${followed.username}`;
    }

    const updatedUser = await userRepository.getUserWithFollowers(followedId);

    return {
        message,
        followersCount: (updatedUser as any).followers.length, 
        updatedUser
    };
};
