import {prisma} from "../prisma/index.js";


export const loadNotifications = async (req, res) => {

    try {

        const userIdFromToken = req.user.id;

        const notifications = await prisma.notification.findMany({
            where: {
                user_id: userIdFromToken,
            },
            include: {
                notifier: true,
                post: {
                    include: {
                        images: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json(notifications)

    } catch (err) {

        console.error(err.message);
        res.status(500).json('Server Error');
    }

}


export const createLikeNotification = async (req, res) => {
    try {


        const userIdFromToken = req.user.id

        const { post_id } = req.params;

        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(post_id)
            },
            select: {
                user_id: true
            }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }


        if (userIdFromToken === post.user_id) {
            res.status(201).json({
                liked: res.locals.liked,
                likes: res.locals.likes
            });
            return
        }

        if (res.locals.liked) {
            await prisma.notification.create({
                data: {
                    type: 'LIKE',
                    post_id: parseInt(post_id),
                    notifier_id: userIdFromToken,
                    user_id: post.user_id,
                    like_id: res.locals.like.id
                }
            });
        }

        res.status(201).json({
            liked: res.locals.liked,
            likes: res.locals.likes
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Notification creation failed' });
    }
};




export const createFollowNotification = async (req, res) => {

    try {
        


    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Notification creation failed' });
    }
}


export const createCommentNotification = async (req, res) => {

    try {

        const user_id = req.user.id;
        const { post_id } = req.params;

        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(post_id)
            },
            select: {
                user_id: true
            }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (user_id === post.user_id) {
            return res.status(200).json({
                comment: res.locals.comment,
                message: "Comment created!"
            });
        }

        await prisma.notification.create({
            data: {
                type: 'COMMENT',
                post_id: parseInt(post_id),
                notifier_id: user_id,
                user_id: post.user_id,
                comment_id: res.locals.comment_id,
            }
        });

        return res.status(200).json({
            comment: res.locals.comment,
            message: "Comment created!"
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Notification creation failed' });
    }
}