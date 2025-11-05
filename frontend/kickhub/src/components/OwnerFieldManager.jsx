import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import OwnerField from "../../public/สนามของเรา.png";

export default function OwnerFieldManager() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mapLink: "",
    price: "",
    openTime: "",
    closeTime: "",
    fieldType: "หญ้าเทียม",
    promptPay: "",
    amenities: [],
    description: "",
    image: null,
  });

  
  const amenitiesList = ["ห้องน้ำ", "ที่จอดรถ", "ร้านค้า", "wifi free"];

  const handleAmenityToggle = (item) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ข้อมูลสนามที่บันทึก:", formData);
    alert("เพิ่มสนามเรียบร้อยแล้ว!");
    setShowForm(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 overflow-y-auto pb-10">
      {/* HEADER */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <img
          src={OwnerField}
          alt="OwnerField"
          className="w-full h-full object-cover"
        />
      </div>

      {/* BODY */}
      <div className="relative w-[24.5rem] bg-white rounded-t-2xl shadow-lg p-6 mt-[-1rem] mb-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">จัดการสนามใหม่</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg px-3 py-2 shadow-md transition-all duration-200"
          >
            + เพิ่มสนามใหม่
          </button>
        </div>

        {!showForm ? (
          <div className="border border-gray-300 rounded-xl text-center text-gray-500 p-8">
            <p>ยังไม่มีสนามในระบบ</p>
            <p>เริ่มต้นด้วยการเพิ่มสนามใหม่</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <input
              type="text"
              placeholder="ชื่อสนาม"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            <input
              type="text"
              placeholder="ที่ตั้ง"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            <input
              type="text"
              placeholder="ลิงก์ Google Map"
              value={formData.mapLink}
              onChange={(e) =>
                setFormData({ ...formData, mapLink: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            <input
              type="text"
              placeholder="ราคา/ชม."
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            {/* เวลาเปิดปิด */}
            <div className="flex gap-2">
              <div className="flex items-center border rounded-lg p-2 w-1/2">
                <FaClock className="text-gray-500 mr-2" />
                <input
                  type="time"
                  value={formData.openTime}
                  onChange={(e) =>
                    setFormData({ ...formData, openTime: e.target.value })
                  }
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center border rounded-lg p-2 w-1/2">
                <FaClock className="text-gray-500 mr-2" />
                <input
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closeTime: e.target.value })
                  }
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* ประเภทสนาม */}
            <select
              value={formData.fieldType}
              onChange={(e) =>
                setFormData({ ...formData, fieldType: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="หญ้าแท้">หญ้าแท้</option>
              <option value="หญ้าเทียม">หญ้าเทียม</option>
            </select>

            {/* พร้อมเพย์ */}
            <input
              type="text"
              placeholder="หมายเลขพร้อมเพย์"
              value={formData.promptPay}
              onChange={(e) =>
                setFormData({ ...formData, promptPay: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            {/* สิ่งอำนวยความสะดวก */}
            <div>
              <p className="text-gray-700 font-medium mb-2">
                สิ่งอำนวยความสะดวกและสภาพแวดล้อม
              </p>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleAmenityToggle(item)}
                    className={`px-3 py-1 rounded-full border ${
                      formData.amenities.includes(item)
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-400 text-gray-600"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="รายละเอียดเพิ่มเติม"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-lg p-2 min-h-[100px]"
            />

            {/* รูปภาพ */}
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
              <label className="cursor-pointer">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="preview"
                    className="mx-auto rounded-lg max-h-40 object-cover"
                  />
                ) : (
                  <div>
                    <p className="text-gray-600 text-sm">
                      Click to upload image
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* ปุ่ม */}
            <div className="flex gap-3 mt-4 pb-10">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold"
              >
                เพิ่มสนาม
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
