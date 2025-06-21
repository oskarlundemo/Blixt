import {prisma} from "../prisma/index.js";


export const loadFeed = async (req, res) => {

    try {
        const userIdFromToken = req.user.id;

        const following = await prisma.follows.findMany({
            where: {
                follower_id: userIdFromToken,
            },
            include: {
                followed: {
                    include: {
                        posts: {
                            include: {
                                images: true,
                                likes: true,
                                comments: {
                                    include: {
                                        user: true,
                                    }
                                },
                                poster: true,
                            }
                        },
                    }
                }
            }
        })

        let posts = [];
        following.forEach(follow => {
            posts.push(...follow.followed.posts);
        });

        posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        console.log(posts);

        res.status(200).json(posts)

    } catch (err) {
        console.log(err)
        res.status(500).json({err: err, message: "Server error"});
    }

}