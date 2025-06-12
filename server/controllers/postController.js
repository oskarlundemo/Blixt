import {prisma} from "../prisma/index.js";
import {cloudinary} from "../middleware/cloudinary.js";



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





export const likePost = async (req, res, next) => {

    try {

        const {user_id, post_id} = req.params;
        let liked = true;

        let like;

        const alreadyLiked = await prisma.likes.findFirst({
            where: {
                post_id: parseInt(post_id),
                user_id: user_id,
            }
        })

        if (!alreadyLiked) {
            like = await prisma.likes.create({
                data: {
                    user_id: user_id,
                    post_id: parseInt(post_id),
                }
            })
        } else {
            like = await prisma.likes.delete({
                where: {
                    id: alreadyLiked.id
                }
            })

            await prisma.notification.deleteMany({
                where: {
                    like_id: alreadyLiked.id,
                },
            });

            liked = false;
        }


        const likes = await prisma.likes.findMany({
            where: {
                post_id: parseInt(post_id),
            }
        })

        res.locals.liked = liked
        res.locals.likes = likes
        res.locals.like = like

        next();

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


function extractPublicIdFromUrl(url) {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    return afterUpload.replace(/\.[^/.]+$/, ''); // remove extension like .jpg
}


export const deletePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const userIdFromToken = req.user.id;

        const post = await prisma.post.findUnique({
            where: { id: parseInt(post_id) },
        });

        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.user_id !== userIdFromToken)
            return res.status(403).json({ error: "Unauthorized action" });

        const images = await prisma.images.findMany({ where: { id: parseInt(post_id) } });

        for (const image of images) {
            const publicId = extractPublicIdFromUrl(image.url);
            await cloudinary.v2.uploader.destroy(publicId);
        }

        await prisma.post.delete({ where: { id: parseInt(post_id) } });

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};



export const createComment = async (req, res, next) => {

    try {

        const {user_id, post_id} = req.params;
        const {comment} = req.body;

        if (!comment) {
            return res.status(400).json({ error: "Comment is required" });
        }

        const comment_id = await prisma.comments.create({
            data: {
                user_id: user_id,
                post_id: parseInt(post_id),
                comment: comment
            }
        })

        res.locals.comment_id = comment_id.id;

        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}