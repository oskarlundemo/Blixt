



import {Router} from 'express';
import {
    fetchFollowers,
    fetchPosts,
    fetchUser,
    InspectSinglePost, loadFeed, sendProfileData
} from "../controllers/profileController.js";


const profileRoute = Router();

profileRoute.get('/fetch/data/:user_id', fetchPosts, fetchUser, fetchFollowers, sendProfileData);

profileRoute.get('/inspect/:post_id', InspectSinglePost)

profileRoute.get('/load/:feed/:user_id', loadFeed)


export default profileRoute