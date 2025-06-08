



import {Router} from "express";
import {enrichToken} from "../controllers/userController.js";

const UserRoute = new Router();

UserRoute.get('/token/:user_id', enrichToken);


export default UserRoute;