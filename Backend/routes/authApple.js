const express = require("express");
const router = express.Router();
const appleSignin = require("apple-signin-auth");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /auth/apple
router.post("/apple", async (req, res) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing ID Token" });
    }

    // Verify Apple Token
    const decoded = await appleSignin.verifyIdToken(id_token, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false,
    });

    const email = decoded.email;
    const name = decoded.name || "Apple User";

    // หา user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "APPLE_AUTH",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    console.error("Apple Login Error:", err);
    res.status(500).json({ status: "error", message: "Apple Login Failed" });
  }
});

module.exports = router;
