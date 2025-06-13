


import {Router} from "express";
import {loadNotifications} from "../controllers/notificationsController.js";
import {authenticateUser} from "../middleware/supabase.js";

const notificationsRoute = Router();


notificationsRoute.get('/load', authenticateUser, loadNotifications);


export default notificationsRoute;