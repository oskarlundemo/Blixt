import {prisma} from "../prisma/index.js";


export const loadFeed = async (req, res) => {

    try {

        const userIdFromToken = req.user.id;

        const usersPosts = await prisma.post.findMany({
            where: {
                user_id: userIdFromToken,
            },
            include: {
                images: true,
                likes: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                poster: true,
            },
        });


        const following = await prisma.follows.findMany({
            where: {
                follower_id: userIdFromToken,
            },
            select: {
                followed_id: true,
            },
        });

        const followedIds = following.map(f => f.followed_id);

        const followedPosts = await prisma.post.findMany({
            where: {
                user_id: {
                    in: followedIds,
                },
            },
            include: {
                images: true,
                likes: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                poster: true,
            },
        });


        const allPosts = [...usersPosts, ...followedPosts];
        allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.status(200).json(allPosts);

    } catch (err) {
        console.log(err)
        res.status(500).json({err: err, message: "Server error"});
    }
}