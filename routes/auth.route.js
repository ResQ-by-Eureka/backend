const passport = require("passport");
require("../auth/google.auth.js");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send({ status: 401, message: "Unauthorized" });
}

// router.post(
//   "/",
//   registerUser,
//   passport.authenticate("local", { failureRedirect: "/" }),
//   (req, res, next) => {
//     res.send({ status: 200, message: "Success" });
//   }
// );

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    access_type: "offline",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // console.log(req.user);
    // console.log(req.session)
    req.session.user_id = req.user.id;
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // res.redirect(`http://localhost:3000/auth/?token=${token}`);
    res.redirect(`https://salva-eureka.netlify.app/auth/?token=${token}`);
  }
);

// router.get("/profile", ensureAuthenticated, (req, res) => {
//   res.send({ status: 200, message: "Success", username: req.user.username });
// });

// router.post(
//   "/login",
//   passport.authenticate("local", { failureRedirect: "/" }),
//   (req, res) => {
//     res.send({ status: 200, message: "Success" });
//   }
// );

router.get("/logout", (req, res) => {
  req.logout();
  res.send({ status: 200, message: "Success" });
});

module.exports = router;
