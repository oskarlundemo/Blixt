import {prisma} from "../prisma/index.js";



export const createNewPost = async (req, res) => {
    try {

        if (!req.files?.length) {
            return res.status(400).json({ error: 'Missing files' });
        }

        const files = req.files;
        const caption = req.body.caption;
        const userId = req.params.user_id

        console.log(userId);

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            }
        })

        if (!user)
            console.log('No user' + user)

        const newPost = await prisma.post.create({
            data: {
                caption: caption,
                user_id: userId,
            }
        })


        console.log(newPost);

        const imagesData = files.map((file, index) => ({
            post_id: newPost.id,
            url: file.path,
            index: index
        }));

        await prisma.images.createMany({ data: imagesData });

        res.status(200).json({ message: 'Post succuesfully created!'});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}




export const fetchEnrichedComments = async (req, res) => {

    try {

        const {comment_id} = req.params;

        const enrichedComment = await prisma.comments.findFirst({
            where: {
                id: comment_id,
            },
            include: {
                user: true
            }
        })

        res.status(200).json(enrichedComment);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }

}





export const likePost = async (req, res) => {

    try {

        const {user_id, post_id} = req.params;
        let liked = true;

        const alreadyLiked = await prisma.likes.findFirst({
            where: {
                post_id: parseInt(post_id),
                user_id: user_id,
            }
        })

        if (!alreadyLiked) {
            await prisma.likes.create({
                data: {
                    user_id: user_id,
                    post_id: parseInt(post_id),
                }
            })
        } else {
            await prisma.likes.delete({
                where: {
                    id: alreadyLiked.id
                }
            })

            liked = false;
        }

        const likes = await prisma.likes.findMany({
            where: {
                post_id: parseInt(post_id),
            }
        })

        res.status(200).json({ liked: liked, likes: likes, message: 'Post succuesfully liked!'});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}



export const getComments = async (req, res) => {

    try {

        const comments = await prisma.comments.findMany({
            where: {
                post_id: parseInt(req.params.post_id)
            },
            include: {
                user: true
            }
        })

        return res.status(200).json({comments})

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}



export const createComment = async (req, res) => {

    try {

        const {user_id, post_id} = req.params;
        const {comment} = req.body;

        if (!comment) {
            return res.status(400).json({ error: "Comment is required" });
        }

        await prisma.comments.create({
            data: {
                user_id: user_id,
                post_id: parseInt(post_id),
                comment: comment
            }
        })

        return res.status(200).json({ message: "Comment created!" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}