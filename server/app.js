import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import createAccountRoute from "./routes/createAccountRoute.js";
import loginRoute from "./routes/loginRoute.js";
import PostsRoute from "./routes/postsRoute.js";
import { v2 as cloudinary } from 'cloudinary';
import profileRoute from "./routes/profileRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


const app = express()
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.use('/users', userRoute)
app.use('/profile', profileRoute);
app.use('/auth/signup', createAccountRoute);
app.use('/auth/login', loginRoute);
app.use('/posts', PostsRoute)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
