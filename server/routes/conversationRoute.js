import {Router} from 'express';
import {authenticateUser} from "../middleware/supabase.js";
import {
    createGroupConversation,
    loadConversations,
    createPrivateConversation,
    fetchConversationMessages,
    kickUserFromConversation,
    deleteConversation,
    addMemberToConversation, searchForNewGroupMembers, loadNewConversationCard, latestMessage,
} from "../controllers/conversationController.js";


const conversationRoute = new Router();

conversationRoute.post('/latest/message/:conversation_id', authenticateUser, latestMessage);

conversationRoute.post('/new/invite', authenticateUser, loadNewConversationCard)

conversationRoute.get('/load/:conversation_id', authenticateUser, fetchConversationMessages);

conversationRoute.delete('/delete/:conversation_id', authenticateUser, deleteConversation);

conversationRoute.delete('/kick/:conversation_id', authenticateUser, kickUserFromConversation);

conversationRoute.post('/create/group', authenticateUser, createGroupConversation)

conversationRoute.post('/create/private', authenticateUser, createPrivateConversation)

conversationRoute.post('/add/member/:conversation_id', authenticateUser, addMemberToConversation)

conversationRoute.get('/search/members/:conversation_id', authenticateUser, searchForNewGroupMembers)

conversationRoute.get('/fetch', authenticateUser, loadConversations);




export default conversationRoute;