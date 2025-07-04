



import {Router} from 'express'
import {authenticateUser} from "../middleware/supabase.js";
import {
    createGroupChat,

    searchForUsers
} from "../controllers/createChatController.js";



const createChatRoute = Router();


createChatRoute.get('/search', authenticateUser, searchForUsers)

createChatRoute.post('/create/group', authenticateUser, createGroupChat)



export default createChatRoute