




import {Router} from 'express'
import {
    createGroupMessage,
    createPrivateMessage,
    fetchMessagesByConversation,
    fetchPrivateMessages
} from "../controllers/messagesController.js";
import {authenticateUser} from "../middleware/supabase.js";


const messagesRoute = new Router();

messagesRoute.get('/fetch/by-user/:username', authenticateUser, fetchPrivateMessages)

messagesRoute.get('/fetch/by-conversation/:conversation_id', authenticateUser, fetchMessagesByConversation)

messagesRoute.post('/create/by-user/:username', authenticateUser, createPrivateMessage);

messagesRoute.post('/create/by-conversation/:conversation_id', authenticateUser, createGroupMessage);


export default messagesRoute;