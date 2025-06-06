
import express from "express";
import cors from "cors";
import createAccountRoute from "./routes/createAccountRoute.js";
import loginRoute from "./routes/loginRoute.js";
import PostsRoute from "./routes/postsRoute.js";

const app = express()
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.use('/auth/signup', createAccountRoute);
app.use('/auth/login', loginRoute);
app.use('/posts', PostsRoute)


app.get("/", (req, res) => {
    res.send("API is running");
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
