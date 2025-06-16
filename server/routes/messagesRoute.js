




import {Router} from 'express'
import {
    createGroupMessage,
    createPrivateMessage, fetchEnrichedPrivateMessage,
    fetchMessagesByConversation,
    fetchPrivateMessages
} from "../controllers/messagesController.js";
import {authenticateUser} from "../middleware/supabase.js";


const messagesRoute = new Router();

messagesRoute.get('/fetch/by-user/:username', authenticateUser, fetchPrivateMessages)

messagesRoute.get('/fetch/by-conversation/:conversation_id', authenticateUser, fetchMessagesByConversation)

messagesRoute.post('/create/private/:username', authenticateUser, createPrivateMessage);

messagesRoute.post('/create/by-conversation/:conversation_id', authenticateUser, createGroupMessage);

messagesRoute.post('/fetch/private/new/enriched', authenticateUser, fetchEnrichedPrivateMessage);


export default messagesRoute;