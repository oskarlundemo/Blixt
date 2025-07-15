



import {Router} from "express";
import {enrichToken, searchForUsers, updateAvatar, updateBio} from "../controllers/userController.js";

const UserRoute = new Router();
import upload from "../middleware/upload.js";
import {authenticateUser} from "../middleware/supabase.js";



UserRoute.get('/token/:user_id', enrichToken);

UserRoute.post('/update/profile', authenticateUser, upload.single('avatar'), updateBio, updateAvatar);

UserRoute.get('/search', authenticateUser, searchForUsers)




export default UserRoute;