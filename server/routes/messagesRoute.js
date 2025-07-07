




import {Router} from 'express'
import {
    createMessage, fetchEnrichedMessage, sendGif
} from "../controllers/messagesController.js";
import {authenticateUser} from "../middleware/supabase.js";


const messagesRoute = new Router();

messagesRoute.post('/create/new/:conversation_id', authenticateUser, createMessage)

messagesRoute.post('/send/gif/:conversation_id', authenticateUser, sendGif);

messagesRoute.post('/fetch/enriched/message/:conversation_id', authenticateUser, fetchEnrichedMessage);


export default messagesRoute;