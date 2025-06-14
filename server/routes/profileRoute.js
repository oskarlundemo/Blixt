



import {Router} from 'express';
import {
    fetchFollowers,
    fetchPosts,
    follow,
    inspectSinglePost, loadFeed, sendProfileData
} from "../controllers/profileController.js";
import {authenticateUser} from "../middleware/supabase.js";


const profileRoute = Router();

profileRoute.get('/fetch/data/:username', authenticateUser, fetchPosts, fetchFollowers, sendProfileData);

profileRoute.get('/inspect/:post_id', authenticateUser, inspectSinglePost)

profileRoute.get('/load/:feed/:user_id', loadFeed)

profileRoute.post('/follow/:profile_id', authenticateUser, follow);


export default profileRoute