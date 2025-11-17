const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },

    email: { type: String, lowercase: true },

    password: { type: String },

    role: {
      type: String,
      enum: ["owner", "user"],
      default: "user",
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "apple"],
      default: "local",
    },

    googleId: { type: String, default: null },
    appleId: { type: String, default: null },

    profile_photo: { type: String, default: "" },
    profile_photo_cover: { type: String, default: "" },
    mobile_number: { type: String, default: "" },

    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },

    last_login: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
