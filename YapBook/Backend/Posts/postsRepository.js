const prisma = require('../prisma/client');

exports.findCommentById = async (id) => {
    return await prisma.comment.findUnique({ where: { id } });
};

exports.findPostById = async (id) => {
    return await prisma.post.findUnique({ where: { id } });
};

exports.findLike = async (userId, entityId, isComment) => {
    return await prisma.like.findUnique({
        where: {
            ...(isComment
                ? { userId_commentId: { userId, commentId: entityId } }
                : { userId_postId: { userId, postId: entityId } })
        }
    });
};

exports.addLike = async (userId, entityId, isComment) => {
    return await prisma.like.create({
        data: {
            userId,
            ...(isComment ? { commentId: entityId } : { postId: entityId })
        }
    });
};

exports.removeLike = async (userId, entityId, isComment) => {
    return await prisma.like.delete({
        where: {
            ...(isComment
                ? { userId_commentId: { userId, commentId: entityId } }
                : { userId_postId: { userId, postId: entityId } })
        }
    });
};

exports.findShare = async (userId, postId) => {
    return await prisma.share.findUnique({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });
};

exports.addShare = async (userId, postId) => {
    return await prisma.share.create({
        data: {
            userId,
            postId
        }
    });
};

exports.removeShare = async (userId, postId) => {
    return await prisma.share.delete({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });
};

exports.fetchAllPosts = async () => {
    return await prisma.post.findMany({
        include: {
            comments: {
                include: {
                    user: true,
                    likes: true,
                }
            },
            author: true,
            likes: true,
            shares: {
                include: {
                    user: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

exports.fetchSharedPosts = async () => {
    return await prisma.share.findMany({
        select: {
            id: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    username: true,
                }
            },
            postId: true,
            post: {
                select: {
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                }
                            },
                            likes: true,
                        }
                    },
                    shares: true,
                    likes: true,
                    id: true,
                    content: true,
                    imageUrl: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            imageUrl: true,
                        }
                    },
                    createdAt: true,
                }
            }
        }
    });
};

exports.fetchRandomUsers = async (followerIds) => {
    try {
        return await prisma.user.findMany({
            where: {
                id: {
                    notIn: followerIds.length > 0 ? followerIds : [], // Exclude followers and current user
                },
            },
            select: {
                id: true,
                username: true,
                imageUrl: true,
            },
            orderBy: {
                id: 'asc',
            },
            take: 7, // only need 7 suggestions
        });
    } catch (error) {
        console.error('Error fetching random users:', error);
        throw new Error('Could not fetch random users'); // throw error for further handling if needed
    }
};

exports.findPostWithDetails = async (postId) => {
    return await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: true,
            comments: {
                include: {
                    user: true,
                }
            },
            likes: true,
            shares: true
        }
    });
};

exports.createPost = async (userId, content, imageUrl) => {
    return await prisma.post.create({
        data: {
            content,
            imageUrl,
            authorId: userId
        }
    });
};

exports.updatePost = async (postId, newContent) => {
    return await prisma.post.update({
        where: { id: postId },
        data: { content: newContent }
    });
};

exports.deleteRelatedData = async (postId) => {
    await prisma.comment.deleteMany({ where: { postId } });
    await prisma.like.deleteMany({ where: { postId } });
    await prisma.share.deleteMany({ where: { postId } });
};

exports.deletePost = async (postId) => {
    return await prisma.post.delete({ where: { id: postId } });
};
