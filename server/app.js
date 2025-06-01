
import express from "express";
import cors from "cors";
import createAccountRoute from "./routes/createAccountRoute.js";
import loginRoute from "./routes/loginRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth/signup', createAccountRoute);
app.use('/auth/login', loginRoute);

app.get("/", (req, res) => {
    res.send("API is running");
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
