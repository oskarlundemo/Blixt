import {prisma} from "../prisma/index.js";


export const loadFeed = async (req, res) => {

    try {
        const {user_id} = req.params;

        const following = await prisma.follows.findMany({
            where: {
                follower_id: user_id,
            },
            select: {
                followed_id: true,
            }
        })

        const followingIds = following.map(f => f.followed_id);
        const userAndFollowingIds = [...followingIds, user_id]

        const posts = await prisma.post.findMany({
            where: {
                user_id: {
                    in: userAndFollowingIds
                },
                archived: false
            },
            include: {
                images: true,
                poster: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                likes: true,
            },
            orderBy: {
                created_at: 'desc',
            }
        })

        res.status(200).json(posts)

    } catch (err) {
        console.log(err)
        res.status(500).json({err: err, message: "Server error"});
    }


}