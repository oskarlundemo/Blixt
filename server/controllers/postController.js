import {prisma} from "../prisma/index.js";
import {deleteResourceFromCloudinary} from "../middleware/cloudinary.js";

/**
 * What does this function do?
 * Inserts a new post into the posts table when a user creates one
 *
 * What inputs does it expect?
 * Token, files sent through multer and caption from the body
 *
 * What does it return or send back?
 * The data of the message
 */


export const createNewPost = async (req, res) => {
    try {

        if (!req.files?.length) { // If there are no files, return missing files
            return res.status(400).json({ error: 'Missing files' });
        }

        const files = req.files; // Files from multer
        const caption = req.body.caption; // Caption from the body
        const userId = req.user.id // Id from token

        // Create the new post
        const newPost = await prisma.post.create({
            data: {
                caption: caption,
                user_id: userId,
            }
        })

        // Extract the data from each image that was uploaded
        const imagesData = files.map((file, index) => ({
            post_id: newPost.id,
            url: file.path,
            index: index,
            file_name: file.filename,
        }));

        // Insert all images (ref) into the db
        await prisma.images.createMany({ data: imagesData });

        res.status(200).json({ message: 'Post successfully created!'});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * What does this function do?
 * Fetches the complimentary data when a user writes a comment
 *
 * What inputs does it expect?
 * Token and the id of the comment through the params
 *
 * What does it return or send back?
 * An updated comment object
 */


export const fetchEnrichedComments = async (req, res) => {

    try {

        const {comment_id} = req.params; // Id of comment

        // Get the enriched version
        const enrichedComment = await prisma.comments.findFirst({
            where: {
                id: comment_id,
            },
            include: {
                user: true
            }
        })

        // Send int
        res.status(200).json(enrichedComment);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * What does this function do?
 * Inserts a new like into the db when the user likes a post
 *
 * What inputs does it expect?
 * Token and the id of the post through the params
 *
 * What does it return or send back?
 * Just a 200 code with success
 */



export const likePost = async (req, res, next) => {

    try {

        const userIdFromToken = req.user.id // Id from token

        const {post_id} = req.params; // Id of post
        let liked = true; // Variable to hold if liked

        let like;

        // Does the user already like the post?
        const alreadyLiked = await prisma.likes.findFirst({
            where: {
                post_id: parseInt(post_id),
                user_id: userIdFromToken,
            }
        })

        // No, then insert a like
        if (!alreadyLiked) {
            like = await prisma.likes.create({
                data: {
                    user_id: userIdFromToken,
                    post_id: parseInt(post_id),
                }
            })
        } else {
            // Yes! Then delete that like
            like = await prisma.likes.delete({
                where: {
                    id: alreadyLiked.id
                }
            })

            // Also delete that notification, could be deleted on cascade here **
            await prisma.notification.deleteMany({
                where: {
                    like_id: alreadyLiked.id,
                },
            });
            liked = false;
        }

        // Returns a new list of likes
        const likes = await prisma.likes.findMany({
            where: {
                post_id: parseInt(post_id),
            }
        })

        res.locals.liked = liked // Does the user already like it?
        res.locals.likes = likes // List of likes for the post
        res.locals.like = like // Did the like it?

        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * What does this function do?
 * Fetches all the comments associated with a post
 *
 * What inputs does it expect?
 * Token and the id of the post through the params
 *
 * What does it return or send back?
 * All the comments and a bool if the post is the users
 */

export const getComments = async (req, res) => {
    try {

        const userIdFromToken = req.user.id; // Id from token
        let isUsersPost = false; // Is it their post?

        // Find the post
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(req.params.post_id)
            },
            select: {
                user_id: true
            }
        });


        // No post, then return
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // If the poster is the user, then true
        if (post.user_id === userIdFromToken) {
            isUsersPost = true;
        }

        // Fetch all the comments associated with that post
        const comments = await prisma.comments.findMany({
            where: {
                post_id: parseInt(req.params.post_id)
            },
            include: {
                user: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return res.status(200).json({
            isUsersPost,
            comments
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * What does this function do?
 * Deletes a comment from the db
 *
 * What inputs does it expect?
 * Token and id of the comment passed through the params
 *
 * What does it return or send back?
 * 200 code with a success message
 */

export const deleteComment = async (req, res) => {
    try {

        const userIdFromToken = req.user.id; // Id from user
        const commentId = parseInt(req.params.comment_id); // Id of comment

        // Find the comment
        const comment = await prisma.comments.findUnique({
            where: { id: commentId },
            select: { user_id: true },
        });

        // Does not exist, return
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Find the notification
        const notification = await prisma.notification.findFirst({
            where: {
                type: 'COMMENT',
                comment_id: commentId,
            }
        })

        // If there is a notification, then delete it
        if (notification) {
            await prisma.notification.delete({
                where: {
                    comment_id: commentId,
                }
            })
        }

        if (comment.user_id !== userIdFromToken) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        // Delete the comment
        await prisma.comments.delete({ where: { id: commentId } });

        return res.status(200).json({ message: 'Comment deleted' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

/**
 * What does this function do?
 * Archives a post from the public
 *
 * What inputs does it expect?
 * Token and id of the post passed through the params
 *
 * What does it return or send back?
 * 200 code with a success message
 */

export const archivePost = async (req, res) => {


    try {

        const userIdFromToken = req.user.id // Of the user
        const postID = parseInt(req.params.post_id); // Id of the post
        let message;
        let isPublic;


        // Find the post
        const post = await prisma.post.findFirst({
            where: {
                id: postID
            }
        })

        if (!post) return res.status(404).json({ error: "Post not found" }); // Return if it does not exist

        // If the creator of the post is not the token, then they cant archive it
        if (post.user_id !== userIdFromToken)
            return res.status(403).json({ error: "Unauthorized action" });

        // If it is already archived, then make it public
        if (post.archived) {
            await prisma.post.update({
                where: {
                    id: postID
                },
                data: {
                    archived: false,
                }
            })
            isPublic = false;
            message = 'Post made public successfully'
        } else {
            // Already public, make it private / archived
            await prisma.post.update({
                where: {
                    id: postID
                },
                data: {
                    archived: true,
                }
            })
            isPublic = true;
            message = 'Post archived successfully'
        }

        return res.status(200).json({message, isPublic});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * What does this function do?
 * Delete a post that a user has created
 *
 * What inputs does it expect?
 * Token and id of the post taken through the params
 *
 * What does it return or send back?
 * 200 code with a success message
 */


export const deletePost = async (req, res) => {
    try {

        const { post_id } = req.params; // Get post Id
        const userIdFromToken = req.user.id; // Get user id

        // Find the post
        const post = await prisma.post.findUnique({
            where: { id: parseInt(post_id) },
        });

        // If there is no post
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Only the creator of the post can delete it
        if (post.user_id !== userIdFromToken)
            return res.status(403).json({ error: "Unauthorized action" });

        // Find all the images associated
        const images = await prisma.images.findMany({ where: { post_id: parseInt(post_id) } });

        // Delete the resource from cloudinary
        for (const image of images) {
            await deleteResourceFromCloudinary(image.file_name);
        }

        // Delete the post from db
        await prisma.post.delete({ where: { id: parseInt(post_id) } });

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", message: "An error occurred while deleting post" });
    }
};

/**
 * What does this function do?
 * This function creates a new comment when
 *
 * What inputs does it expect?
 * Token, comment from the body and the id of the post taken through the params
 *
 * What does it return or send back?
 * 200 code with a success message
 */

export const createComment = async (req, res, next) => {

    try {

        const { post_id} = req.params; // Id of the post
        const {comment} = req.body; // Comment through the body
        const userIdFromToken = req.user.id; // Id from token

        // If there is no comment in the body, return
        if (!comment) {
            return res.status(400).json({ error: "Comment is required" });
        }

        // Create the comment
        const newComment = await prisma.comments.create({
            data: {
                user_id: userIdFromToken,
                post_id: parseInt(post_id),
                comment: comment
            },
            include: {
                user: true,
            }
        })

        res.locals.comment_id = newComment.id; // Append to the middleware
        res.locals.comment = newComment; // Append to the middleware

        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error', message: 'There was an error creating comment' });
    }
}