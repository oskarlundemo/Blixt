



import { Router } from "express";
import {
    createNewPost,
    likePost,
    createComment,
    getComments,
    fetchEnrichedComments, deletePost
} from "../controllers/postController.js";
import upload from "../middleware/upload.js";
import {createCommentNotification, createLikeNotification} from "../controllers/notificationsController.js";
import {authenticateUser} from "../middleware/supabase.js";

const PostRoute = new Router();

PostRoute.post('/new/:user_id', upload.array('images', 10), createNewPost);

PostRoute.post('/like/:post_id/:user_id', likePost, createLikeNotification);

PostRoute.post('/comment/new/:post_id/:user_id', createComment, createCommentNotification);

PostRoute.get('/comments/all/:post_id', getComments);

PostRoute.get('/comments/new/:post_id/:comment_id', fetchEnrichedComments);

PostRoute.delete('/delete/:post_id/', authenticateUser, deletePost)

export default PostRoute;