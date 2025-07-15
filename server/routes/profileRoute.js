



import {Router} from 'express';
import {
    fetchConversation,
    fetchFollowers,
    fetchPosts,
    follow,
    inspectSinglePost, sendProfileData
} from "../controllers/profileController.js";
import {authenticateUser} from "../middleware/supabase.js";


const profileRoute = Router();

profileRoute.get('/fetch/data/:username', authenticateUser, fetchPosts, fetchFollowers, sendProfileData);

profileRoute.get('/inspect/:post_id', authenticateUser, inspectSinglePost)

profileRoute.post('/follow/:profile_id', authenticateUser, follow);

profileRoute.post('/initiate/conversation/:username', authenticateUser, fetchConversation);


export default profileRoute