

const express = require("express");
const cors = require("cors");
const createAccountRoute = require("./routes/createAccountRoute");
const loginRoute = require("./routes/loginRoute");
const app = express();

app.use(cors());
app.use(express.json());

app.use('/login/account', loginRoute);
app.use('/create/account', createAccountRoute);

app.get("/", (req, res) => {
    res.send("API is running");
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
