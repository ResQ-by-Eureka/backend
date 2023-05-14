const passport = require("passport");
const { registerUser } = require("../controllers/auth.controller");
const router = require("express").Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send({ status: 401, message: "Unauthorized" });
}

router.post(
  "/",
  registerUser,
  passport.authenticate("local", { failureRedirect: "/" }),
  (req, res, next) => {
    res.send({ status: 200, message: "Success" });
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
    // access_type: "offline",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.session.user_id = req.user.id;
    res.send({ status: 200, message: "Success" });
  }
);

router.get("/profile", ensureAuthenticated, (req, res) => {
  res.send({ status: 200, message: "Success", username: req.user.username });
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/" }),
  (req, res) => {
    res.send({ status: 200, message: "Success" });
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.send({ status: 200, message: "Success" });
});

module.exports = router;