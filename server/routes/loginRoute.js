



import {Router} from "express";
import { loginGuestAccount } from "../controllers/loginController.js";

const LoginRoute = new Router();
LoginRoute.post('/guest', loginGuestAccount)

export default LoginRoute;