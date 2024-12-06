import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createComment = async (userId: number, postId: number, content: string) => {
    return await prisma.comment.create({
        data: {
            content,
            userId,
            postId
        },
        include: {
            user: true
        }
    });
};

export const findCommentById = async (commentId: number) => {
    return await prisma.comment.findUnique({
        where: { id: commentId }
    });
};

export const deleteComment = async (commentId: number) => {
    return await prisma.comment.delete({
        where: { id: commentId }
    });
};
