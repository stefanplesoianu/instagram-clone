const prisma = require('../prisma/client');

const follow = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const followerId = req.user.id; 
        const followedId = parseInt(req.params.id, 10); 

        if (isNaN(followedId) || isNaN(followerId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        //users cannot follow themselves
        if (followerId === followedId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const [follower, followed] = await Promise.all([
            prisma.user.findUnique({ where: { id: followerId } }),
            prisma.user.findUnique({ where: { id: followedId } })
        ]);

        if (!follower || !followed) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingFollow = await prisma.userFollowing.findUnique({
            where: {
                userId_followerId: {
                    userId: followedId,
                    followerId: followerId
                }
            }
        });

        let message;
        if (existingFollow) {
            await prisma.userFollowing.delete({
                where: {
                    userId_followerId: {
                        userId: followedId,
                        followerId: followerId
                    }
                }
            });
            message = `You unfollowed ${followed.username}`;
        } else {
            await prisma.userFollowing.create({
                data: {
                    userId: followedId,
                    followerId: followerId
                }
            });
            message = `You followed ${followed.username}`;
        }

        const updatedUser = await prisma.user.findUnique({
            where: { id: followedId },
            select: {
                id: true,
                username: true,
                followers: {
                    select: {
                        followerId: true
                    }
                }
            }
        });

        return res.status(200).json({
            message,
            followersCount: updatedUser.followers.length,
            updatedUser
        });
    } catch (error) {
        console.error('Error following/unfollowing user:', error);
        return res.status(500).json({ message: 'Something went wrong, try again' });
    }
};


module.exports = { follow };
