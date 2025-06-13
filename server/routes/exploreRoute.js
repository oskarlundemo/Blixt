



import {Router} from 'express';
import {fetchMatchingUsers, getAllPosts} from "../controllers/exploreController.js";
import {authenticateUser} from "../middleware/supabase.js";


const exploreRoute = new Router();


exploreRoute.get('/search', authenticateUser, fetchMatchingUsers);

exploreRoute.get('/load/posts', authenticateUser, getAllPosts);


export default exploreRoute;