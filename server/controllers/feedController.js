import {prisma} from "../prisma/index.js";


/**
 * What does this function do?
 * It loads the feed of the logged-in user
 *
 * What inputs does it expect?
 * Token
 *
 * What does it return or send back?
 * An array of all the posts from the profile the user is following
 */


export const loadFeed = async (req, res) => {

    try {

        const userIdFromToken = req.user.id;

        const usersPosts = await prisma.post.findMany({
            where: {
                user_id: userIdFromToken,
                archived: false
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
                archived: false,
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