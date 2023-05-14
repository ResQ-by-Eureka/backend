const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
// const { ObjectID } = require("mongodb");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = new PrismaClient();

// app.use(passport.initialize());
// app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user.id);
});

const prismFind = async (id, done) => {
  await prisma.user.find({
    where: id,
  });
};

passport.deserializeUser((id, done) => {
  prismaFind({ id: id }).then((err, doc) => {
    done(null, doc);
  });
  // myDatabase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
  //   done(null, doc);
  // });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    prismaFind({ username }).then((err, user) => {
      console.log(`User ${username} attempted to log in.`);
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!password == user.password) return done(null, false);
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

const addUser = async (profile) => {
  await prisma.user.update(
    {
      where: { id: profile.id },
      data: {
        id: profile.id,
        username: profile.username,
        name: profile.displayName || "John Doe",
        photo: profile.photos[0].value || "",
        email: Array.isArray(profile.emails)
          ? profile.emails[0].value
          : "No public email",
        created_on: new Date(),
        provider: profile.provider || "",
        lastLogin: new Date(),
        loginCount: 1,
      },
    },
    { upsert: true, new: true },
    (err, doc) => {
      return cb(null, doc.value);
    }
  );
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://salva.vercel.app/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      addUser(profile, cb);
    }
  )
);

const registerUser = async (req, res, next) => {
  prisma.user
    .find({ where: { username: req.body.username } })
    .then((err, user) => {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect("/");
      } else {
        const hash = bcrypt.hashSync(req.body.password, 12);
        prisma.user
          .create({
            username: req.body.username,
            // password: req.body.password,
            password: hash,
          })
          .then((err, doc) => {
            if (err) {
              res.redirect("/");
            } else {
              // The inserted document is held within
              // the ops property of the doc
              next(null, doc.ops[0]);
            }
          });
      }
    });
};

module.exports = { registerUser };
