



import {Router} from 'express';
import {FetchProfilePosts, InspectSinglePost} from "../controllers/profileController.js";


const profileRoute = Router();

profileRoute.get('/fetch/posts/:user_id', FetchProfilePosts)

profileRoute.get('/inspect/:post_id', InspectSinglePost)


export default profileRoute