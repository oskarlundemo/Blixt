



import {Router} from 'express';
import {FetchProfilePosts, FetchProfileUser, InspectSinglePost} from "../controllers/profileController.js";


const profileRoute = Router();

profileRoute.get('/fetch/posts/:user_id', FetchProfilePosts)

profileRoute.get('/fetch/user/:user_id', FetchProfileUser)

profileRoute.get('/inspect/:post_id', InspectSinglePost)


export default profileRoute