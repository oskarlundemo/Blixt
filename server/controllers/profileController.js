import {prisma} from "../prisma/index.js";


export const follow = async (req, res) => {
    try {

        const userIDFromToken = req.user.id;
        const {profile_id} = req.params;

        if (userIDFromToken === profile_id) {
            return res.status(400).json({ message: "You can't follow yourself." });
        }

        let follows = false;

        const alreadyFollowing = await prisma.follows.findFirst({
            where: {
                follower_id: userIDFromToken,
                followed_id: profile_id,
            }
        });

        if (alreadyFollowing) {
            await prisma.follows.delete({
                where: { id: alreadyFollowing.id }
            });

            return res.status(200).json({
                message: 'Unfollow',
                follows
            });
        }

        await prisma.follows.create({
            data: {
                follower_id: userIDFromToken,
                followed_id: profile_id,
            }
        });

        follows = true;

        return res.status(200).json({
            follows
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong',
            error: err.code || err.message
        });
    }
};




export const fetchFollowers = async (req, res, next) => {

    try {

        const inspectedUserProfile = res.locals.inspectedUserProfile;

        const followers = await prisma.follows.findMany({
            where: {
                followed_id: inspectedUserProfile.id,
            }
        })

        const following = await prisma.follows.findMany({
            where: {
                follower_id: inspectedUserProfile.id,
            }
        })

        res.locals.followers = followers;
        res.locals.following = following;

        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong', error: err,
        })
    }
}


export const sendProfileData = async (req, res) => {
    res.status(200).json({
        user: res.locals.inspectedUserProfile,
        posts: res.locals.posts,
        followers: res.locals.followers,
        following: res.locals.following,
        archive: res.locals.archivedPosts
    });
}



export const fetchPosts = async (req, res, next) => {

    try {

        const userIDFromToken = req.user.id;
        const username = decodeURIComponent(req.params.username);
        let archivedPosts;


        const inspectedUserProfile = await prisma.user.findUnique({
            where: {
                username: username
            }
        })


        const posts = await prisma.post.findMany({
            where: {
                user_id: inspectedUserProfile.id,
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
                created_at: 'desc'
            }
        })

        if (inspectedUserProfile.id === userIDFromToken) {
            archivedPosts = await prisma.post.findMany({
                where: {
                    archived: true,
                    user_id: userIDFromToken
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
                    created_at: 'desc'
                }
            })
        }

        res.locals.inspectedUserProfile = inspectedUserProfile;
        res.locals.archivedPosts = archivedPosts;
        res.locals.posts = posts;
        next();

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Something went wrong', error: err
        })
    }
}


export const inspectSinglePost = async (req, res) => {

    try {

        const postID = parseInt(req.params.post_id);

        const post = await prisma.post.findUnique({
            where: {
                id: postID
            }, include: {
                images: true,
                poster: true,
                comments: {
                    include: {
                        user: true,
                    },
                },
                likes: true,
            }
        })

        res.status(200).json(post)

    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Something went wrong', error: err});
    }
}


export const loadFeed = async (req, res) => {

    try {
        const {user_id} = req.params;

        const posts = await prisma.post.findMany({
            where: {
                user_id: user_id,
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
            }
        })

        res.status(200).json(posts)

    } catch (err) {
        console.error(err);
        res.status(500).json({err: err, message: "Server error"});
    }
}
