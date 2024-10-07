const prisma = require('../prisma/client');
const { cloudinary, upload, extractPublicId } = require('../cloudinaryConfig');

// first fetch all shared posts
const fetchSharedPosts = async () => {
    const shares = await prisma.share.findMany({
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

    return shares;
};

// fetching all original posts
const fetchAllPosts = async () => {
    const posts = await prisma.post.findMany({
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

    return posts;
};

const fetchRandomUsers = async (followerIds) => {
    try {
        const randomUsers = await prisma.user.findMany({
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

        return randomUsers;
    } catch (error) {
        console.error('Error fetching random users:', error);
        throw new Error('Could not fetch random users'); // throw error for further handling if needed
    }
};

// single function for retrieving posts for guests and users; avoids redundancy
const handleGetPosts = async (req, res, isUser = false) => {
    try {
        const followerIds = req.body.followerIds || [];
        const posts = await fetchAllPosts();
        const sharedPosts = await fetchSharedPosts();

        if (isUser) {
            const randomUsers = await fetchRandomUsers(followerIds)
            return res.status(200).json({ posts, sharedPosts, users: randomUsers });
        } else {
            return res.status(200).json({ posts, sharedPosts });
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the posts' });
    }
};

const getGuestPosts = (req, res) => handleGetPosts(req, res, false);
const getUserPosts = (req, res) => handleGetPosts(req, res, true);

//retrieving data for rendering a single post

const openPost = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId, 10);
        const post = await prisma.post.findUnique({
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

        if (!post) {
            return res.status(404).json({ message: 'Could not find post' });
        }

        return res.status(200).json({ post });
    } catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the post' });
    }
};

const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const file = req.file;

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!file) {
            return res.status(400).json({ message: 'File needed to create post' });
        }

        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'YapBookPosts',
            allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'webp']
        });

        const post = await prisma.post.create({
            data: {
                content,
                imageUrl: result.secure_url,
                authorId: userId
            }
        });

        return res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'An error occurred while creating the post' });
    }
};

const editPost = async (req, res) => {
    try {
        const { newContent } = req.body;
        const postId = parseInt(req.params.id, 10);

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!newContent || newContent === post.content) {
            return res.status(400).json({ message: 'No changes made' });
        }

        const editedPost = await prisma.post.update({
            where: { id: postId },
            data: { content: newContent }
        });

        return res.status(200).json(editedPost);
    } catch (error) {
        console.error('Error editing post:', error);
        return res.status(500).json({ message: 'An error occurred while updating the post' });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // check for existing image to remove it
        if (post.imageUrl) {
            const publicId = extractPublicId(post.imageUrl);
            await cloudinary.uploader.destroy(publicId);
        }

        // removing everything related to the post from the database before deleting the post
        await prisma.comment.deleteMany({ where: { postId } })
        await prisma.like.deleteMany({ where: { postId } })
        await prisma.share.deleteMany({ where: { postId } })

        await prisma.post.delete({ where: { id: postId } });

        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
};

module.exports = {
    getUserPosts,
    getGuestPosts,
    createPost,
    editPost,
    deletePost,
    openPost
};
