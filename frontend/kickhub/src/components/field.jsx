import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaSearch, FaFire } from "react-icons/fa";
import KH from "../../public/KH.png";
import fieldImg from "../../public/thefield.png";
import { useNavigate } from "react-router-dom";
import TimeSelector from "./testtime";

export default function FindCreateParty() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // const apiUrl = import.meta.env.VITE_API_URL || "http://192.168.1.26:3000";
  const apiUrl = import.meta.env.VITE_API_URL || "http://172.20.10.4:3000";

  const fetchAvailableFields = async (start_datetime, end_datetime) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("กรุณาเข้าสู่ระบบก่อนค้นหาสนาม");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${apiUrl}/api/available-fields?start_time=${start_datetime}&end_time=${end_datetime}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.status === "success") {
        setFields(result.data);
        console.log(result.data);
      } else {
        setError(result.message || "ไม่พบข้อมูลสนาม");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFacilitiesList = (facilities) => {
    if (!facilities || typeof facilities !== "object") return [];

    const labels = {
      lights: "ไฟส่องสว่าง",
      parking: "ที่จอดรถ",
      restroom: "ห้องน้ำ",
      shop: "ร้านค้า",
      wifi: "Wi-Fi ฟรี",
    };

    return Object.keys(facilities)
      .filter((key) => facilities[key]) // ✅ เฉพาะที่เป็น true
      .map((key) => labels[key] || key); // ✅ แปลงเป็นชื่อไทย
  };

  const handleSearch = ({ start_datetime, end_datetime }) => {
    if (!start_datetime || !end_datetime) return;
    setSelectedTime({ start_datetime, end_datetime });
    fetchAvailableFields(start_datetime, end_datetime);
  };

  const filteredFields = fields.filter((f) =>
    f.field_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center font-noto-thai min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="relative w-full max-w-md h-40">
        {/* Search bar */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center bg-white rounded-full shadow-sm px-3 py-1 w-60">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาสนามบอล"
              className="flex-1 ml-2 outline-none border-none bg-transparent text-sm text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <img
          src={KH}
          alt="Header"
          className="object-cover w-full h-full rounded-b-3xl"
        />
      </div>

      {/* BODY */}
      <div className="bg-white rounded-t-3xl shadow-inner w-full max-w-md p-5 -mt-4 flex-1 overflow-y-auto">
        <TimeSelector onSubmit={handleSearch} />

        {loading && (
          <p className="text-center text-gray-500 mt-4">กำลังโหลดข้อมูล...</p>
        )}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        <div className="flex flex-col gap-4 mt-4">
          {filteredFields.map((field) => (
            <div
              key={field._id}
              className="bg-gray-100 shadow-sm rounded-2xl overflow-hidden transition hover:shadow-lg"
            >
              <div className="flex p-4">
                <img
                  src={
                    field.image
                      ? `${apiUrl}/uploads/photos/${field.image}`
                      : fieldImg
                  }
                  alt={field.field_name}
                  className="w-28 h-28 rounded-xl object-cover"
                />

                <div className="ml-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                      {field.field_name}
                    </h3>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <FaMapMarkerAlt className="text-green-500 mr-1" />
                    <span>{field.address}</span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      {field.price} บาท/ชม.
                    </span>
                    <div className="flex items-center bg-white rounded-lg px-2 py-1 text-xs text-gray-700 font-medium">
                      <FaClock className="mr-1 text-gray-600" />
                      {field.open} - {field.close}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getFacilitiesList(field.facilities).length > 0 ? (
                        getFacilitiesList(field.facilities).map((item, i) => (
                          <span
                            key={i}
                            className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">
                          ไม่มีข้อมูลเพิ่มเติม
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-gray-200 px-4 py-2">
                <span className="bg-green-600 text-white px-4 py-1 rounded-md text-sm font-medium">
                  ว่าง
                </span>
                <button
                  onClick={() => {
                    if (!selectedTime) {
                      alert("กรุณาเลือกวันที่และเวลา ก่อนจองสนาม");
                      return;
                    }

                    // แปลงเวลาเปิดสนามและเวลาเลือกจากผู้ใช้เป็น Date object
                    const selectedStart = new Date(selectedTime.start_datetime);
                    const openTimeParts = field.open?.split(":") || [
                      "00",
                      "00",
                    ];
                    const openTime = new Date(selectedStart);
                    openTime.setHours(
                      parseInt(openTimeParts[0]),
                      parseInt(openTimeParts[1]),
                      0,
                      0
                    );

                    // ถ้าเวลาเลือกมาก่อนเวลาเปิด หรือเท่ากับเวลาเปิด
                    if (selectedStart <= openTime) {
                      alert(
                        `สนาม ${field.field_name} ยังไม่เปิด กรุณาเลือกเวลาหลัง ${field.open}`
                      );
                      return;
                    }

                    // ผ่านการตรวจสอบแล้ว ไปต่อได้
                    navigate(`/reserve/${field._id}`, {
                      state: {
                        data: field,
                        time: selectedTime,
                      },
                    });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm font-medium transition"
                >
                  จองเลย →
                </button>
              </div>
            </div>
          ))}

          {!loading && filteredFields.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              ไม่พบสนามที่ตรงกับคำค้นหา
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
