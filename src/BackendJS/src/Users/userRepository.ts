import prisma from '../prisma/client';

export const getAllUsers = async (currentUserId: number) => {
    return await prisma.user.findMany({
        where: { id: { not: currentUserId } },
        select: { id: true, username: true }
    });
};

export const searchUser = async (searchTerm: string) => {
    return await prisma.user.findMany({
        where: {
            username: { contains: searchTerm, mode: 'insensitive' }
        }
    });
};

export const getUser = async (userId: number) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: { followers: true, following: true, posts: true, shares: true }
    });
};

export const findUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({ where: { username } });
};

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (email: string, username: string, password: string, imageUrl: string) => {
    return await prisma.user.create({
        data: { email, username, password, imageUrl }
    });
};

export const blacklistToken = async (token: string, decoded: any) => {
    return await prisma.blacklistToken.create({
        data: {
            token,
            expiryDate: new Date((decoded as any).exp * 1000),
            userId: (decoded as any).id || null,
            guestId: (decoded as any).guestId || null
        }
    });
};

export const findUserById = async (userId: number) => {
    return await prisma.user.findUnique({ where: { id: userId } });
};

export const updateUserPhoto = async (userId: number, imageUrl: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { imageUrl }
    });
};

export const updateUserBio = async (userId: number, bio: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { bio }
    });
};

export const getUserFollowers = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            followers: { 
                include: { follower: true }
            }
        }
    });
// @ts-ignore   ts kept detecting the f in the map function below
    return user ? user.followers.map(f => f.follower) : [];
};

export const getUserFollowing = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            following: { 
                include: { user: true }
            }
        }
    });
// @ts-ignore   ts kept detecting the f in the map function below
    return user ? user.following.map(f => f.user) : [];
};

export const getUserById = async (userId: number) => {
    return await prisma.user.findUnique({ where: { id: userId } });
};

export const getExistingFollow = async (followerId: number, followedId: number) => {
    return await prisma.userFollowing.findUnique({
        where: {
            userId_followerId: {
                userId: followedId,
                followerId: followerId 
            }
        }
    });
};

export const followUser = async (followerId: number, followedId: number) => {
    return await prisma.userFollowing.create({
        data: {
            userId: followedId,
            followerId: followerId 
        }
    });
};

export const unfollowUser = async (followerId: number, followedId: number) => {
    return await prisma.userFollowing.delete({
        where: {
            userId_followerId: {
                userId: followedId, 
                followerId: followerId 
            }
        }
    });
};

export const getUserWithFollowers = async (userId: number) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            followers: {
                select: { followerId: true } 
            }
        }
    });
};
