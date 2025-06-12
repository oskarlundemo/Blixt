import {prisma} from "../prisma/index.js";


export const fetchUser = async (req, res, next) => {


    try {

        const userId = req.params.user_id;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        res.locals.user = user;
        next();

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Something went wrong', error: err
        })
    }
}


export const follow = async (req, res, next) => {
    try {
        const { user_profile_id, logged_in_user_id } = req.params;
        let follows = false;

        const alreadyFollowing = await prisma.follows.findFirst({
            where: {
                follower_id: logged_in_user_id,
                followed_id: user_profile_id,
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

        // Otherwise, follow the user
        await prisma.follows.create({
            data: {
                follower_id: logged_in_user_id,
                followed_id: user_profile_id,
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

        const userId = req.params.user_id;

        const followers = await prisma.follows.findMany({
            where: {
                followed_id: userId,
            }
        })

        const following = await prisma.follows.findMany({
            where: {
                follower_id: userId,
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


export const sendProfileData = async (req, res, next) => {
    res.status(200).json({
        user: res.locals.user,
        posts: res.locals.posts,
        followers: res.locals.followers,
        following: res.locals.following,
    });
}



export const fetchPosts = async (req, res, next) => {

    try {

        const userID = req.params.user_id;

        const posts = await prisma.post.findMany({
            where: {
                user_id: userID,
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


        res.locals.posts = posts;
        next();

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Something went wrong', error: err
        })
    }

}


export const InspectSinglePost = async (req, res) => {

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
