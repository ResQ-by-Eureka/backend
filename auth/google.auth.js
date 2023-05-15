const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  prisma.user
    .findUnique({
      where: { id },
    })
    .then((doc) => {
      // console.log(err);
      done(null, doc);
    });
  // myDatabase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
  //   done(null, doc);
  // });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      prisma.user
        .findUnique({
          where: { id: profile.id },
        })
        .then((resp) => {
          if (resp) {
            prisma.user
              .update({
                where: { id: profile.id },
                data: {
                  name: profile.displayName || "John Doe",
                  photo: profile.photos[0].value || "",
                  provider: profile.provider || "",
                  loginCount: { increment: 1 },
                  lastLogin: new Date(),
                },
              })
              .then((user) => {
                cb(null, user);
              });
          } else {
            prisma.user
              .create({
                // where: { id: profile.id },
                data: {
                  id: profile.id,
                  // username: profile.username,
                  name: profile.displayName || "John Doe",
                  photo: profile.photos[0].value || "",
                  email: Array.isArray(profile.emails)
                    ? profile.emails[0].value
                    : "No public email",
                  provider: profile.provider || "",
                },
              })
              .then((user) => {
                cb(null, user);
              });
          }
        });
    }
  )
);