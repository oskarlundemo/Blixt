




import {Router} from 'express'
import {
    createMessage, fetchEnrichedMessage, sendGif
} from "../controllers/messagesController.js";
import {authenticateUser} from "../middleware/supabase.js";


const messagesRoute = new Router();

messagesRoute.post('/create/new/:conversation_id', authenticateUser, createMessage)

messagesRoute.post('/send/gif/:conversation_id', authenticateUser, sendGif);

/**
 * Ta bort dessa två
 */

messagesRoute.post('/fetch/enriched/message', authenticateUser, fetchEnrichedMessage);


export default messagesRoute;