



import {Router} from 'express';
import {fetchMatchingUsers} from "../controllers/exploreController.js";


const exploreRoute = new Router();


exploreRoute.get('/search/:user_id', fetchMatchingUsers);


export default exploreRoute;