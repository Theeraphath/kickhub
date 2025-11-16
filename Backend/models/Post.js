const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    party_name: { type: String, required: true },

    mode: {
      type: String,
      enum: ["fixed", "flexible"],
      required: true,
    },

    field_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },

    field_name: { type: String, required: true },
    address: { type: String, required: true },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    host_name: { type: String, required: true },

    // ⭐ รูปโปรไฟล์ของ host (คนสร้างปาร์ตี้)
    host_image: { type: String, default: null },

    description: { type: String },
    image: { type: String },

    start_datetime: { type: Date, required: true },
    end_datetime: { type: Date, required: true },

    // ล็อคตำแหน่ง
    required_positions: [
      {
        position: { type: String, enum: ["GK", "FW", "DF", "MF"] },
        amount: { type: Number, default: 0 },
      },
    ],

    // บุฟเฟ่ต์
    total_required_players: { type: Number },

    // ⭐ ผู้เข้าร่วม + รูปโปรไฟล์
    participants: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String },

        // ⭐ เพิ่มรูปโปรไฟล์ผู้เล่น
        profile_image: { type: String, default: null },

        position: {
          type: String,
          enum: ["GK", "FW", "DF", "MF", null],
          default: null,
        },
        status: { type: String, default: "Joined" },
        joined_at: { type: Date, default: Date.now },
      },
    ],

    price: { type: Number, required: true },
    google_map: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
