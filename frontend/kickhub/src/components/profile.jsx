import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import findparty from "../../public/party2.png";
import fieldImg from "../../public/field.jpg";
import { useNavigate } from "react-router-dom";
import Messi from "../../public/lionel-messi.jpg";
import Messi2 from "../../public/messi2.jpg";

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
    <div className="flex flex-col items-center font-noto-thai">
      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
          {/* 🔹 Cover Image Section */}
          <div className="w-full max-w-3xl relative">
            <div className="h-48 bg-gray-300 rounded-2xl overflow-hidden">
              {Messi ? (
                <img
                  src={Messi}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Cover Image
                </div>
              )}
            </div>

            {/* 🔹 Profile Image */}
            <div className="absolute -bottom-30 left-1">
              <div className="relative">
                <img src={Messi2}  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-white object-cover" />
              </div>
              <div>
                <button 
                onClick={() => navigate("/profile2")} 
                className="bg-green-500 text-white border rounded-lg px-4 py-2 mt-2">
                  แก้ไขโปรไฟล์
                </button>
              </div>
            </div>
          </div>

          {/* 🔹 Form Section */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-white mt-35 p-6 rounded-2xl shadow "
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              สนามที่เคยเข้าร่วม/ปาร์ตี้
            </h2>
          </form>
        </div>
      </div>
    </div>
  );
}
