const postsRepository = require('./postsRepository');
const { cloudinary, extractPublicId } = require('../cloudinaryConfig');

exports.handleLike = async (req, res, checkOnly) => {
    const userId = req.user.id;
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

exports.handleShare = async (req, res, checkOnly) => {
    const userId = parseInt(req.user.id);
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

exports.getPosts = async (req, res, isUser) => {
    const followerIds = req.body.followerIds || [];
    const posts = await postsRepository.fetchAllPosts();
    const sharedPosts = await postsRepository.fetchSharedPosts();

    if (isUser) {
        const randomUsers = await postsRepository.fetchRandomUsers(followerIds);
        return { status: 200, data: { posts, sharedPosts, users: randomUsers } };
    } else {
        return { status: 200, data: { posts, sharedPosts } };
    }
};

exports.openPost = async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const post = await postsRepository.findPostWithDetails(postId);

    if (!post) {
        return { status: 404, data: { message: 'Could not find post' } };
    }

    return { status: 200, data: { post } };
};

exports.createPost = async (req, res) => {
    const { content } = req.body;
    const file = req.file;

    if (!file) {
        return { status: 400, data: { message: 'File needed to create post' } };
    }

    const userId = req.user.id;
    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'YapBookPosts',
        allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'webp']
    });

    const post = await postsRepository.createPost(userId, content, result.secure_url);
    return { status: 201, data: post };
};

exports.editPost = async (req, res) => {
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

exports.deletePost = async (req, res) => {
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
