




import {Router} from 'express'
import {
    createGroupMessage,
    createPrivateMessage, fetchEnrichedGroupMessage, fetchEnrichedPrivateMessage,
    fetchMessagesByConversation,
    fetchPrivateMessages
} from "../controllers/messagesController.js";
import {authenticateUser} from "../middleware/supabase.js";


const messagesRoute = new Router();

messagesRoute.get('/fetch/by-user/:username', authenticateUser, fetchPrivateMessages)

messagesRoute.get('/fetch/by-conversation/:group_id', authenticateUser, fetchMessagesByConversation)

messagesRoute.post('/create/private/:username', authenticateUser, createPrivateMessage);

messagesRoute.post('/create/group/:group_id', authenticateUser, createGroupMessage);

messagesRoute.post('/fetch/private/new/enriched', authenticateUser, fetchEnrichedPrivateMessage);

messagesRoute.post('/fetch/group/new/enriched', authenticateUser, fetchEnrichedGroupMessage);



export default messagesRoute;