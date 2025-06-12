


import {Router} from "express";
import {loadNotifications} from "../controllers/notificationsController.js";

const notificationsRoute = Router();


notificationsRoute.get('/load/:user_id', loadNotifications);


export default notificationsRoute;