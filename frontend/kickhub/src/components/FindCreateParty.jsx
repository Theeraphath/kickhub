import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import findparty from "../../public/party2.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FindCreateParty() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ เพิ่ม state โหลดข้อมูล

  // ✅ ดึงข้อมูลสนามจาก backend
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/fields", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFields(res.data || []);
      } catch (error) {
        console.error("Error fetching fields:", error);
        setFields([]); // กันกรณี error จะไม่เป็น undefined
      } finally {
        setLoading(false); // ✅ ปิดโหลดเมื่อเสร็จ
      }
    };
    fetchFields();
  }, []);

  // ✅ ฟิลเตอร์ค้นหา
  const filteredFields = fields.filter((field) =>
    field.field_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ ฟังก์ชันแปลง facilities object → array ภาษาไทย
  const getFacilitiesList = (facilities) => {
    if (!facilities || typeof facilities !== "object") return [];
    const facilityNames = {
      parking: "ที่จอดรถ",
      restroom: "ห้องน้ำ",
      shop: "ร้านค้า",
      wifi: "Wi-Fi ฟรี",
    };
    return Object.keys(facilities)
      .filter((key) => facilities[key])
      .map((key) => facilityNames[key] || key);
  };

  return (
    <div className="flex flex-col items-center">
      {/* HEADER */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <div className="absolute top-5 left-36 z-10">
          <form className="flex items-center bg-white rounded-full shadow-sm px-3 py-2 w-[200px]">
            <button type="button" className="text-gray-400">
              <svg
                width={17}
                height={16}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="search"
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <input
              className="flex-1 px-2 py-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              placeholder="ค้นหาสนามบอล"
              required
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <img
          src={findparty}
          alt="findparty"
          className="w-full h-full object-cover"
        />
      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        <h2 className="text-black font-bold mb-4 text-lg">
          ค้นหาปาร์ตี้ / สร้างปาร์ตี้
        </h2>

        {/* ✅ แสดงสถานะโหลด */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">กำลังโหลดข้อมูล...</p>
        ) : filteredFields.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            ไม่พบสนามที่ตรงกับคำค้นหา
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredFields.map((field) => (
              <div
                key={field._id}
                className="bg-white shadow-md rounded-2xl p-4 flex flex-col"
              >
                <div className="flex">
                  <img
                    src={field.image}
                    alt={field.field_name}
                    className="w-[120px] h-[100px] object-cover rounded-xl"
                  />

                  <div className="ml-4 flex flex-col justify-between flex-1 overflow-hidden">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {field.field_name}
                      </h3>

                      <div
                        onClick={() => window.open(field.google_map, "_blank")}
                        className="flex items-center mt-1 text-gray-500 text-sm cursor-pointer hover:text-green-600 truncate"
                      >
                        <FaMapMarkerAlt className="text-green-500 mr-1 flex-shrink-0" />
                        <span className="truncate underline">
                          {field.address}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 overflow-hidden w-full">
                      <div className="flex flex-row flex-nowrap items-center gap-2 w-full">
                        {/* กล่องราคา */}
                        <p className="text-white bg-green-500 font-semibold py-[2px] px-2 rounded-md text-[11px] shrink-0">
                          {field.price} บาท/ชม.
                        </p>

                        {/* กล่องเวลา ปรับขนาดเล็กลง */}
                        <div className="flex items-center justify-center bg-gray-100 shadow-sm rounded-md px-1.5 py-[1px] text-[10px] font-semibold text-gray-700 shrink-0 w-auto max-w-fit">
                          <FaClock className="mr-1 text-gray-500 text-[9px]" />
                          <span className="whitespace-nowrap">
                            {field.open} - {field.close}
                          </span>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="flex flex-row flex-wrap gap-2 overflow-hidden mt-2">
                        {(getFacilitiesList(field.facilities) || []).map(
                          (fac, i) => (
                            <span
                              key={i}
                              className="bg-blue-500 text-white font-medium px-2 py-1 rounded-md text-xs"
                            >
                              {fac}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ปุ่มดูรายละเอียด */}
                <div className="flex justify-end px-4 py-3">
                  <button
                    onClick={() => navigate(`/findandcreate/${field._id}`)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full text-sm transition"
                  >
                    ดูรายละเอียด →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
