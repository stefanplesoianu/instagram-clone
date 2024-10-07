const prisma = require('../prisma/client');

const handleShare = async (req, res, checkOnly = false) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = parseInt(req.user.id);
        const postId = parseInt(req.params.postId)

        if (isNaN(postId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const postExists = await prisma.post.findUnique({ where: { id: postId } });
        if (!postExists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingShare = await prisma.share.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        if (checkOnly) {
            return res.status(200).json(existingShare || { message: 'Post not shared' });
        }

        if (existingShare) {
            await prisma.share.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            });
            return res.status(200).json({ message: 'Share removed' });
        } else {
            const newShare = await prisma.share.create({
                data: {
                    userId,
                    postId
                }
            });
            return res.status(201).json(newShare);
        }
    } catch (error) {
        console.error('Error handling share:', error);
        return res.status(500).json({ message: 'An error occurred while sharing the post' });
    }
};

const share = (req, res) => handleShare(req, res, false);
const checkShare = (req, res) => handleShare(req, res, true);

module.exports = { share, checkShare };
