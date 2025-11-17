const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const session = require("express-session");
const Users = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");
const SECRET_KEY = process.env.SECRET_KEY;

// ตั้งค่า Session สำหรับ Passport
router.use(
  session({
    secret: "mySessionSecret",
    resave: false,
    saveUninitialized: true,
  })
);
router.use(passport.initialize());
router.use(passport.session());

// Serialize/Deserialize User (จำเป็นสำหรับ Passport)
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// ตั้งค่า Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1077329565833-fbehsb7pdsosp9raugum3ctdqemf4tjd.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/login/google/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// ------------------- ROUTES -------------------

// เริ่มต้น login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback จาก Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // เมื่อ Login สำเร็จ → สร้าง JWT
    const token = jwt.sign(
      {
        id: req.user.id,
        name: req.user.displayName,
        email: req.user.emails[0].value,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ✅ redirect กลับไป frontend พร้อม token
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

module.exports = router;
