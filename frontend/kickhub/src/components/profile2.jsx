import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import findparty from "../../public/party2.png";
import fieldImg from "../../public/field.jpg";
import { useNavigate } from "react-router-dom";

export default function FindCreateParty() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(""); // ✅ เพิ่ม state สำหรับค้นหา

  const [fields, setFields] = useState([
    {
      id: 1,
      name: "สนามไรมง",
      location: "คลองหลวง, ปทุมธานี",
      price: 700,
      openingHours: "11:00 - 23:00",
      image: fieldImg,
    },
    {
      id: 2,
      name: "สนามฟุตซอลบางแค",
      location: "บางแค, กรุงเทพฯ",
      price: 600,
      openingHours: "10:00 - 22:00",
      image: fieldImg,
    },
    {
      id: 3,
      name: "สนามฟุตซอลบางแค",
      location: "บางแค, กรุงเทพฯ",
      price: 600,
      openingHours: "10:00 - 22:00",
      image: fieldImg,
    },
  ]);

  // ✅ ฟิลเตอร์เฉพาะชื่อสนาม
  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    birth: "",
    gender: "",
    password: "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Profile Updated!");
  };

  return (
    <div className="flex flex-col items-center">
      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        <div className="absolute top-4 left-4 p-2 border border-gray-300 rounded-lg pt-1 mt-1 bg-green-500 text-white">
            <button
            onClick={() => navigate("/profile")}>back</button>
        </div>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
          {/* 🔹 Cover Image Section */}
          <div className="w-full max-w-3xl relative">
            <div className="h-48 bg-gray-300 rounded-2xl overflow-hidden">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Cover Image
                </div>
              )}
            </div>
            <label className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow cursor-pointer text-sm font-medium">
              Change Cover
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, setCoverImage)}
              />
            </label>

            {/* 🔹 Profile Image */}
            <div className="absolute -bottom-14 left-8">
              <div className="relative">
                <img
                  src={
                    profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-white object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, setProfileImage)}
                  />
                  <span className="text-xs font-medium text-gray-600">📷</span>
                </label>
              </div>
            </div>
          </div>

          {/* 🔹 Form Section */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-white mt-20 p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="date"
                name="birth"
                value={formData.birth}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* 🔹 Change Password Section */}
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
              Change Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Current Password"
                value={formData.password}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
            </div>

            <button
              type="submit"
              className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
