const prisma = require('../prisma/client');

// one function that handles both comments and posts, to avoid redundancy

const handleLike = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user.id;
        const { id, isComment } = req.body;

        const entityId = parseInt(id, 10);
        if (isNaN(entityId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        let entity;
        if (isComment) {
            entity = await prisma.comment.findUnique({ where: { id: entityId } });
        } else {
            entity = await prisma.post.findUnique({ where: { id: entityId } });
        }

        if (!entity) {
            return res.status(404).json({ message: 'Entity not found' });
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                ...(isComment ? { userId_commentId: { userId, commentId: entityId } }
                             : { userId_postId: { userId, postId: entityId } })
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    ...(isComment ? { userId_commentId: { userId, commentId: entityId } }
                                 : { userId_postId: { userId, postId: entityId } })
                }
            });
            return res.status(200).json({ message: 'Like removed' });
        } else {
            const newLike = await prisma.like.create({
                data: {
                    userId,
                    ...(isComment ? { commentId: entityId } : { postId: entityId })
                }
            });
            return res.status(201).json(newLike);
        }
    } catch (error) {
        console.error('Error handling like:', error);
        return res.status(500).json({ message: 'An error occurred while handling the like' });
    }
};

// checkLike so you can render states and button color upon loading components

const checkLike = (req, res) => handleLike(req, res, true);
const like = (req, res) => handleLike(req, res, false);

module.exports = { checkLike, like };