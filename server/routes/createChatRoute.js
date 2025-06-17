



import {Router} from 'express'
import {authenticateUser} from "../middleware/supabase.js";
import {
    createGroupChat,
    createPrivateChat,
    fetchFollowing,
    searchForUsers
} from "../controllers/createChatController.js";



const createChatRoute = Router();

createChatRoute.get('/fetch/following', authenticateUser, fetchFollowing)

createChatRoute.get('/search', authenticateUser, searchForUsers)

createChatRoute.post('/create/group', authenticateUser, createGroupChat)

createChatRoute.post('/create/private', authenticateUser, createPrivateChat)



export default createChatRoute