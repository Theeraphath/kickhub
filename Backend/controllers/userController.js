const Users = require("../models/User");
const bcrypt = require("bcryptjs");

//get user by id
const getUserById = async (id) => {
  try {
    const user = await Users.findById(id);
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, mobile_number } = req.body;
    const profile_photo = req.files?.profile_photo?.[0]
      ? req.files.profile_photo[0].filename
      : null;

    const profile_photo_cover = req.files?.profile_photo_cover?.[0]
      ? req.files.profile_photo_cover[0].filename
      : null;

    await Users.findByIdAndUpdate(req.params.id, {
      name: name,
      email: email,
      mobile_number: mobile_number,
      ...(profile_photo && { profile_photo }),
      ...(profile_photo_cover && { profile_photo_cover }),
    });

    res.json({ status: "success", message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await Users.findById(req.params.id);
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ status: "success", message: "Password changed" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = {
  getUserById,
  updateUserProfile,
  changePassword,
};
