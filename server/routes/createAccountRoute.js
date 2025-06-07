





import {Router} from "express";
import {addUser, signUpUser, uniqueEmail, uniqueUsername} from "../controllers/createAccountController.js";

const createAccountRoute = new Router();

import { body, validationResult } from 'express-validator';


export const validateUserInfo = [
    body('username')
        .trim()
        .isLength({ max: 10 })
        .withMessage('Username is to long, must be between 3 and 10 characters')
        .isLength({ min: 3 })
        .withMessage('Username is to short, must be between 3 and 10 characters')
        .escape()
        .custom(async (username) => {
            const isValid = await uniqueUsername(username).catch(err => {
                throw new Error(err.message);
            });
            return isValid;
        }),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(async (email) => {
            const isValid = await uniqueEmail(email).catch(err => {
                throw new Error(err.message);
            });
            return isValid;
        }),

    body('password').custom((value) => {
        const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
        const hasNumber = /\d/.test(value);
        const isValidLength = value.length >= 8;

        if (!isValidLength) throw new Error('Password must be at least 8 characters long');
        if (!hasSpecialChar) throw new Error('Password must contain at least one special character');
        if (!hasNumber) throw new Error('Password must contain at least one number');
        return true;
    })
];


createAccountRoute.post("/", validateUserInfo, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() }); // Ensure correct format
    }
    signUpUser(req, res, next);
})


createAccountRoute.post('/supabase', addUser)

export default createAccountRoute;