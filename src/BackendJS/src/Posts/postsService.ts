import { Request, Response } from 'express';
import * as postsRepository from './postsRepository';
import { cloudinary, extractPublicId } from '../cloudinaryConfig';

export const handleLike = async (req: Request, res: Response, checkOnly: boolean) => {
    const userId = (req.user as any).id;
    const { id, isComment } = req.body;
    const entityId = parseInt(id, 10);

    if (isNaN(entityId) || isNaN(userId)) {
        return { status: 400, data: { message: 'Invalid ID' } };
    }

    const entity = isComment
        ? await postsRepository.findCommentById(entityId)
        : await postsRepository.findPostById(entityId);

    if (!entity) {
        return { status: 404, data: { message: 'Entity not found' } };
    }

    const existingLike = await postsRepository.findLike(userId, entityId, isComment);

    if (checkOnly) {
        return { status: 200, data: existingLike ? { message: 'Liked' } : { message: 'Not liked' } };
    }

    if (existingLike) {
        await postsRepository.removeLike(userId, entityId, isComment);
        return { status: 200, data: { message: 'Like removed' } };
    } else {
        const newLike = await postsRepository.addLike(userId, entityId, isComment);
        return { status: 201, data: newLike };
    }
};

export const handleShare = async (req: Request, res: Response, checkOnly: boolean) => {
    const userId = parseInt((req.user as any).id);
    const postId = parseInt(req.params.postId);

    if (isNaN(postId) || isNaN(userId)) {
        return { status: 400, data: { message: 'Invalid ID' } };
    }

    const postExists = await postsRepository.findPostById(postId);
    if (!postExists) {
        return { status: 404, data: { message: 'Post not found' } };
    }

    const existingShare = await postsRepository.findShare(userId, postId);

    if (checkOnly) {
        return { status: 200, data: existingShare || { message: 'Post not shared' } };
    }

    if (existingShare) {
        await postsRepository.removeShare(userId, postId);
        return { status: 200, data: { message: 'Share removed' } };
    } else {
        const newShare = await postsRepository.addShare(userId, postId);
        return { status: 201, data: newShare };
    }
};

export const getPosts = async (req: Request, res: Response, isUser: boolean) => {
    const followerIds: number[] = req.body.followerIds || [];
    const posts = await postsRepository.fetchAllPosts();
    const sharedPosts = await postsRepository.fetchSharedPosts();

    if (isUser) {
        const randomUsers = await postsRepository.fetchRandomUsers(followerIds);
        return { status: 200, data: { posts, sharedPosts, users: randomUsers } };
    } else {
        return { status: 200, data: { posts, sharedPosts } };
    }
};

export const openPost = async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId, 10);
    const post = await postsRepository.findPostWithDetails(postId);

    if (!post) {
        return { status: 404, data: { message: 'Could not find post' } };
    }

    return { status: 200, data: { post } };
};

export const createPost = async (req: Request, res: Response) => {
    const { content } = req.body;
    const file = req.file;

    if (!file) {
        return { status: 400, data: { message: 'File needed to create post' } };
    }

    const userId = (req.user as any).id;
    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'YapBookPosts',
        allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'webp']
    });

    const post = await postsRepository.createPost(userId, content, result.secure_url);
    return { status: 201, data: post };
};

export const editPost = async (req: Request, res: Response) => {
    const { newContent } = req.body;
    const postId = parseInt(req.params.id, 10);

    if (isNaN(postId)) {
        return { status: 400, data: { message: 'Invalid post ID' } };
    }

    const post = await postsRepository.findPostById(postId);
    if (!post) {
        return { status: 404, data: { message: 'Post not found' } };
    }

    if (!newContent || newContent === post.content) {
        return { status: 400, data: { message: 'No changes made' } };
    }

    const editedPost = await postsRepository.updatePost(postId, newContent);
    return { status: 200, data: editedPost };
};

export const deletePost = async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
        return { status: 400, data: { message: 'Invalid post ID' } };
    }

    const post = await postsRepository.findPostById(postId);
    if (!post) {
        return { status: 404, data: { message: 'Post not found' } };
    }

    if (post.imageUrl) {
        const publicId = extractPublicId(post.imageUrl);
        await cloudinary.uploader.destroy(publicId);
    }

    await postsRepository.deleteRelatedData(postId);
    await postsRepository.deletePost(postId);

    return { status: 200, data: { message: 'Post deleted successfully' } };
};
