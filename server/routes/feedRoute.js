




import {Router} from 'express';
import {loadFeed} from "../controllers/feedController.js";
import {authenticateUser} from "../middleware/supabase.js";


const feedRouter = Router();


feedRouter.get('/load', authenticateUser, loadFeed);


export default feedRouter