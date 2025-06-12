




import {Router} from 'express';
import {loadFeed} from "../controllers/feedController.js";


const feedRouter = Router();


feedRouter.get('/load/:user_id', loadFeed);


export default feedRouter