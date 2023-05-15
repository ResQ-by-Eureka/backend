const express = require("express");
const app = express();
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // store: store,
    key: "express.sid",
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).send(`Welcome to Salva`);
});

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
