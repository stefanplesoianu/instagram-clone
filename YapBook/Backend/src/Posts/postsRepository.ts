import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findCommentById = async (id: number) => {
    return await prisma.comment.findUnique({ where: { id } });
};

export const findPostById = async (id: number) => {
    return await prisma.post.findUnique({ where: { id } });
};

export const findLike = async (userId: number, entityId: number, isComment: boolean) => {
    return await prisma.like.findUnique({
        where: {
            ...(isComment
                ? { userId_commentId: { userId, commentId: entityId } }
                : { userId_postId: { userId, postId: entityId } })
        }
    });
};

export const addLike = async (userId: number, entityId: number, isComment: boolean) => {
    return await prisma.like.create({
        data: {
            userId,
            ...(isComment ? { commentId: entityId } : { postId: entityId })
        }
    });
};

export const removeLike = async (userId: number, entityId: number, isComment: boolean) => {
    return await prisma.like.delete({
        where: {
            ...(isComment
                ? { userId_commentId: { userId, commentId: entityId } }
                : { userId_postId: { userId, postId: entityId } })
        }
    });
};

export const findShare = async (userId: number, postId: number) => {
    return await prisma.share.findUnique({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });
};

export const addShare = async (userId: number, postId: number) => {
    return await prisma.share.create({
        data: {
            userId,
            postId
        }
    });
};

export const removeShare = async (userId: number, postId: number) => {
    return await prisma.share.delete({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });
};

export const fetchAllPosts = async () => {
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

export const fetchSharedPosts = async () => {
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

export const fetchRandomUsers = async (followerIds: number[]) => {
    try {
        return await prisma.user.findMany({
            where: {
                id: {
                    notIn: followerIds.length > 0 ? followerIds : [],
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

export const findPostWithDetails = async (postId: number) => {
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

export const createPost = async (userId: number, content: string, imageUrl: string) => {
    return await prisma.post.create({
        data: {
            content,
            imageUrl,
            authorId: userId
        }
    });
};

export const updatePost = async (postId: number, newContent: string) => {
    return await prisma.post.update({
        where: { id: postId },
        data: { content: newContent }
    });
};

export const deleteRelatedData = async (postId: number) => {
    await prisma.comment.deleteMany({ where: { postId } });
    await prisma.like.deleteMany({ where: { postId } });
    await prisma.share.deleteMany({ where: { postId } });
};

export const deletePost = async (postId: number) => {
    return await prisma.post.delete({ where: { id: postId } });
};
