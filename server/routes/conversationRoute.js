import {Router} from 'express';
import {authenticateUser} from "../middleware/supabase.js";
import {loadConversations} from "../controllers/conversationController.js";

const conversationRoute = new Router();

conversationRoute.get('/fetch', authenticateUser, loadConversations);

export default conversationRoute;