import { Request, Response } from 'express';
import * as commentsService from './commentsService';

export const createComment = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const postId: number = parseInt(req.params.postId, 10);
        const { content } = req.body;
        const userId: number = (req.user as any).id; 

        if (isNaN(postId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid post ID or user ID' });
        }

        const comment = await commentsService.createComment(userId, postId, content);

        return res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Could not post comment, please try again' });
    }
};

export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const commentId: number = parseInt(req.params.commentId, 10);
        const userId: number = (req.user as any).id; 

        if (isNaN(commentId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid comment ID or user ID' });
        }

        const result = await commentsService.deleteComment(commentId, userId);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
};
