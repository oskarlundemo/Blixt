



import { Router } from "express";
import {createNewPost, likePost, createComment, getComments} from "../controllers/postController.js";
import upload from "../middleware/upload.js";

const PostRoute = new Router();

PostRoute.post('/new/:user_id', upload.array('images', 10), createNewPost);

PostRoute.post('/like/:post_id/:user_id', likePost);

PostRoute.post('/comment/new/:post_id/:user_id', createComment);

PostRoute.get('/comments/all/:post_id', getComments);

export default PostRoute;