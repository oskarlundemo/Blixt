



import {Router} from 'express';
import {
    fetchFollowers,
    fetchPosts,
    fetchUser, follow,
    InspectSinglePost, loadFeed, sendProfileData
} from "../controllers/profileController.js";


const profileRoute = Router();

profileRoute.get('/fetch/data/:user_id', fetchPosts, fetchUser, fetchFollowers, sendProfileData);

profileRoute.get('/inspect/:post_id', InspectSinglePost)

profileRoute.get('/load/:feed/:user_id', loadFeed)

profileRoute.post('/follow/:user_profile_id/:logged_in_user_id', follow);


export default profileRoute