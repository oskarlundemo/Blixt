import {prisma} from "../prisma/index.js";


export const FetchProfileUser = async (req, res) => {


    try {

        const userId = req.params.user_id;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })
        res.status(200).json(user);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Something went wrong', error: err
        })
    }
}



export const FetchProfilePosts = async (req, res) => {

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
            }
        })

        return res.status(200).json({
            posts,
            message: 'Posts posts successfully'
        })

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