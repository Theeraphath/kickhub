// src/components/FindCreateParty.jsx
import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import findparty from "../../public/party2.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FindCreateParty() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const API = "http://172.20.10.4:3000";

  // ===========================
  //  LOAD FIELDS
  // ===========================
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErrorMsg("กรุณาเข้าสู่ระบบก่อนใช้งาน");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API}/api/fields`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fieldsData = (res.data.data || []).map((field) => ({
          ...field,
          facilities:
            typeof field.facilities === "string"
              ? JSON.parse(field.facilities)
              : field.facilities,
        }));

        setFields(fieldsData);
        setErrorMsg("");

      } catch (error) {
        console.error("Error fetching fields:", error);

        if (error.response?.status === 403) {
          setErrorMsg("สิทธิ์การเข้าถึงไม่ถูกต้อง หรือ Token หมดอายุ");
        } else if (error.response?.status === 401) {
          setErrorMsg("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        } else {
          setErrorMsg("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }

        setFields([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const filteredFields = fields.filter((field) =>
    field.field_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===========================
  //  FACILITIES CONVERT
  // ===========================
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

  // ===========================
  //  FIELD IMAGE HANDLER
  // ===========================
  const getFieldImage = (img) => {
    if (!img) return null; // ← no image = return null (we will show “ไม่มีรูป”)

    if (typeof img === "object") {
      if (img.path) return `${API}/${img.path}`;
      if (img.filename) return `${API}/uploads/photos/${img.filename}`;
    }

    if (typeof img === "string") {
      if (img.startsWith("uploads/")) return `${API}/${img}`;
      return `${API}/uploads/photos/${img}`;
    }

    return null;
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
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <img src={findparty} className="w-full h-full object-cover" />
      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        <h2 className="text-black font-bold mb-4 text-lg">
          ค้นหาปาร์ตี้ / สร้างปาร์ตี้
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 mt-10">กำลังโหลดข้อมูล...</p>
        ) : errorMsg ? (
          <p className="text-center text-red-500 mt-10">{errorMsg}</p>
        ) : filteredFields.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            ไม่พบสนามที่ตรงกับคำค้นหา
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredFields.map((field) => {
              const imgUrl = getFieldImage(field.image);

              return (
                <div
                  key={field._id}
                  className="bg-white shadow-md rounded-2xl p-4 flex flex-col"
                >
                  {/* FIELD ROW */}
                  <div className="flex">

                    {/* FIELD IMAGE (with fallback “ไม่มีรูป”) */}
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        className="w-[120px] h-[100px] object-cover rounded-xl bg-gray-100"
                      />
                    ) : (
                      <div className="w-[120px] h-[100px] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        ไม่มีรูป
                      </div>
                    )}

                    {/* DETAILS */}
                    <div className="ml-4 flex flex-col justify-between flex-1 overflow-hidden">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 truncate">
                          {field.field_name}
                        </h3>

                        <div
                          onClick={() => window.open(field.google_map, "_blank")}
                          className="flex items-center mt-1 text-gray-500 text-sm cursor-pointer hover:text-green-600 truncate"
                        >
                          <FaMapMarkerAlt className="text-green-500 mr-1" />
                          <span className="truncate underline">
                            {field.address}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 overflow-hidden w-full">
                        <div className="flex flex-row flex-nowrap items-center gap-2 w-full">
                          <p className="text-white bg-green-500 font-semibold py-[2px] px-2 rounded-md text-[11px] shrink-0">
                            {field.price} บาท/ชม.
                          </p>

                          <div className="flex items-center bg-gray-100 shadow-sm rounded-md px-[5px] py-[0.5px] text-[9.5px] font-semibold text-gray-700">
                            <FaClock className="mr-1 text-gray-500 text-[8px]" />
                            <span>
                              {field.open} - {field.close}
                            </span>
                          </div>
                        </div>

                        {/* Facilities */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {getFacilitiesList(field.facilities)
                            .sort((a, b) => {
                              const order = [
                                "ห้องน้ำ",
                                "ที่จอดรถ",
                                "ร้านค้า",
                                "Wi-Fi ฟรี",
                              ];
                              return order.indexOf(a) - order.indexOf(b);
                            })
                            .map((fac, i) => (
                              <span
                                key={i}
                                className="bg-blue-500 text-white font-medium px-2 py-[2px] rounded-md text-[11px]"
                              >
                                {fac}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <div className="flex justify-end px-4 py-3">
                    <button
                      onClick={() => navigate(`/findandcreate/${field._id}`)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full text-sm transition"
                    >
                      ดูรายละเอียด →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
