import {Router} from 'express';
import {authenticateUser} from "../middleware/supabase.js";
import {
    createGroupConversation, loadConversations,
    createPrivateConversation, fetchConversationMessages,
} from "../controllers/conversationController.js";

const conversationRoute = new Router();

conversationRoute.get('/load/:conversation_id', authenticateUser, fetchConversationMessages);

conversationRoute.post('/create/group', authenticateUser, createGroupConversation)

conversationRoute.post('/create/private', authenticateUser, createPrivateConversation)

conversationRoute.post('/kick/group/:group_id', authenticateUser, loadConversations);

conversationRoute.get('/fetch', authenticateUser, loadConversations);


export default conversationRoute;