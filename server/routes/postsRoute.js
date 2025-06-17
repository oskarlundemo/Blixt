



import { Router } from "express";
import {
    createNewPost,
    likePost,
    createComment,
    getComments,
    fetchEnrichedComments, deletePost, archivePost, deleteComment
} from "../controllers/postController.js";
import upload from "../middleware/upload.js";
import {createCommentNotification, createLikeNotification} from "../controllers/notificationsController.js";
import {authenticateUser} from "../middleware/supabase.js";

const PostRoute = new Router();

PostRoute.post('/create/new', upload.array('images', 10), authenticateUser, createNewPost);

PostRoute.post('/like/:post_id', authenticateUser, likePost, createLikeNotification);

PostRoute.post('/comment/new/:post_id', authenticateUser, createComment, createCommentNotification);

PostRoute.get('/comments/all/:post_id', authenticateUser, getComments);

PostRoute.get('/comments/new/:post_id/:comment_id', fetchEnrichedComments);

PostRoute.delete('/comments/delete/:comment_id/:post_id', authenticateUser, deleteComment);

PostRoute.delete('/delete/:post_id/', authenticateUser, deletePost);

PostRoute.post('/archive/:post_id', authenticateUser, archivePost);

export default PostRoute;