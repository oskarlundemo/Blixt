



import { Router } from "express";
import { createNewPost } from "../controllers/postController.js";
import upload from "../middleware/upload.js";

const PostRoute = new Router();

PostRoute.post('/new/:user_id', upload.array('images', 10), createNewPost);

export default PostRoute;