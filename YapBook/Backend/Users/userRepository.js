const prisma = require('../prisma/client');

exports.getAllUsers = async (currentUserId) => {
    return await prisma.user.findMany({
        where: { id: { not: currentUserId } },
        select: { id: true, username: true }
    });
};

exports.searchUser = async (searchTerm) => {
    return await prisma.user.findMany({
        where: {
            username: { contains: searchTerm, mode: 'insensitive' }
        }
    });
};

exports.getUser = async (userId) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: { followers: true, following: true, posts: true, shares: true }
    });
};

exports.findUserByUsername = async (username) => {
    return await prisma.user.findUnique({ where: { username } });
};

exports.findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};

exports.createUser = async (email, username, password, imageUrl) => {
    return await prisma.user.create({
        data: { email, username, password, imageUrl }
    });
};

exports.blacklistToken = async (token, decoded) => {
    return await prisma.blacklistToken.create({
        data: {
            token,
            expiryDate: new Date(decoded.exp * 1000),
            userId: decoded.id || null,
            guestId: decoded.guestId || null
        }
    });
};

exports.findUserById = async (userId) => {
    return await prisma.user.findUnique({ where: { id: userId } });
};

exports.updateUserPhoto = async (userId, imageUrl) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { imageUrl }
    });
};

exports.updateUserBio = async (userId, bio) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { bio }
    });
};

exports.getUserFollowers = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            followers: { 
                include: { follower: true }
            }
        }
    });
    
    return user ? user.followers.map(f => f.follower) : [];
};

exports.getUserFollowing = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            following: { 
                include: { user: true }
            }
        }
    });

    return user ? user.following.map(f => f.user) : [];
};

exports.getUserById = async (userId) => {
    return await prisma.user.findUnique({ where: { id: userId } });
};

exports.getExistingFollow = async (followerId, followedId) => {
    return await prisma.userFollowing.findUnique({
        where: {
            userId_followerId: {
                userId: followedId,
                followerId: followerId 
            }
        }
    });
};

exports.followUser = async (followerId, followedId) => {
    return await prisma.userFollowing.create({
        data: {
            userId: followedId,
            followerId: followerId 
        }
    });
};

exports.unfollowUser = async (followerId, followedId) => {
    return await prisma.userFollowing.delete({
        where: {
            userId_followerId: {
                userId: followedId, 
                followerId: followerId 
            }
        }
    });
};

exports.getUserWithFollowers = async (userId) => {
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
