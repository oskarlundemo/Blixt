import {Router} from 'express';
import {authenticateUser} from "../middleware/supabase.js";
import {
    createGroupConversation,
    createPrivateConversation,
    loadConversations
} from "../controllers/conversationController.js";

const conversationRoute = new Router();

conversationRoute.get('/fetch', authenticateUser, loadConversations);

conversationRoute.post('/create/group', authenticateUser, createGroupConversation)

conversationRoute.post('/create/private', authenticateUser, createPrivateConversation)

conversationRoute.post('/kick/group/:group_id', authenticateUser, loadConversations);

export default conversationRoute;