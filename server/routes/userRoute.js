



import {Router} from "express";
import {enrichToken, updateAvatar, updateBio} from "../controllers/userController.js";

const UserRoute = new Router();
import upload from "../middleware/upload.js";



UserRoute.get('/token/:user_id', enrichToken);

UserRoute.post('/update/profile/:uuid/:user_id', upload.single('avatar'), updateBio, updateAvatar);


export default UserRoute;