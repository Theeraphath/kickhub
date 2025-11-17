import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";

export default function Profile2() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state;

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://192.168.1.42:3000";
  // const apiUrl = import.meta.env.VITE_API_URL || "http://192.168.1.26:3000";

  useEffect(() => {
    if (!item?.user) return;
    setFormData({
      name: item.user.name || "",
      email: item.user.email || "",
      phone: item.user.mobile_number || "",
      password: "",
      newPassword: "",
    });
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (formData.password && formData.newPassword) {
      const resPass = await fetch(
        `${apiUrl}/api/user/change-password/${item.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: formData.password,
            newPassword: formData.newPassword,
          }),
        }
      );

      const passResult = await resPass.json();
      if (passResult.status !== "success") {
        alert("เปลี่ยนรหัสผ่านไม่สำเร็จ: " + passResult.message);
        return;
      } else {
        alert("เปลี่ยนรหัสผ่านสำเร็จ");
        navigate(-1);
      }
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("mobile_number", formData.phone);

    if (profileImage) formDataToSend.append("profile_photo", profileImage);
    if (coverImage) formDataToSend.append("profile_photo_cover", coverImage);

    const res = await fetch(`${apiUrl}/api/user/update/${item.user._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    const result = await res.json();
    if (result.status === "success") {
      alert("อัปเดตโปรไฟล์สำเร็จ 🎉");
    } else {
      alert("อัปเดตโปรไฟล์ผิดพลาด: " + result.message);
    }
  };

  return (
    <div className="flex flex-col items-center font-noto-thai">
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-full p-5 flex-1 overflow-y-auto max-h-screen">
        <div className="absolute top-4 left-4 p-2 bg-green-500 text-white rounded-lg">
          <button onClick={() => navigate(-1)}>กลับ</button>
        </div>

        <div className="min-h-screen flex flex-col items-center py-10 px-4">
          <div className="w-full max-w-3xl relative">
            <div className="h-48 bg-gray-300 rounded-2xl overflow-hidden">
              {coverPreview || item.user?.profile_photo_cover ? (
                <img
                  src={
                    coverPreview ||
                    `${apiUrl}/uploads/photos/${item.user.profile_photo_cover}`
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
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
                onChange={(e) =>
                  handleImageChange(e, setCoverImage, setCoverPreview)
                }
              />
            </label>

            <div className="absolute -bottom-14 left-8">
              <div className="relative">
                {profilePreview || item.user?.profile_photo ? (
                  <img
                    src={
                      profilePreview ||
                      `${apiUrl}/uploads/photos/${item.user.profile_photo}`
                    }
                    className="w-28 h-28 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <FaCircleUser className="w-28 h-28 text-gray-400" />
                )}
                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageChange(e, setProfileImage, setProfilePreview)
                    }
                  />
                  <span className="text-xs font-medium text-gray-600">📷</span>
                </label>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-white mt-20 p-6 rounded-2xl shadow"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              ข้อมูลโปรไฟล์
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
              />
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
              เปลี่ยนรหัสผ่าน
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="รหัสผ่านเดิม"
                value={formData.password}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
              />

              <input
                type="password"
                name="newPassword"
                placeholder="รหัสผ่านใหม่"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
              />
            </div>

            <button
              type="submit"
              className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
