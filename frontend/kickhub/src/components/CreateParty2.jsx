// =============================
// CreateParty2.jsx (LOCK MODE) — FIXED & COMPLETE VERSION
// =============================

import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import findparty from "../../public/party2.png";
import buffetImg from "../../public/buffetpic.png";
import lockImg from "../../public/lockposition.png";

import GK from "../../public/ประตู.png";
import FW from "../../public/กองหน้า.png";
import MF from "../../public/กองกลาง.png";
import DF from "../../public/กองหลัง.png";

import BottomNav from "./Navbar";

const API = import.meta.env.VITE_API_URL || "http://192.168.1.42:3000";
// const API = "http://192.168.1.26:3000";



export default function CreateParty2() {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [query] = useSearchParams();

  // STATE
  const [fieldData, setFieldData] = useState(null);
  const [userData, setUserData] = useState(null);
  // สำหรับแสดง popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    query.get("date") || new Date().toISOString().split("T")[0]
  );

  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);

  const [time, setTime] = useState("");
  const [hours, setHours] = useState("");
  const [price, setPrice] = useState("");
  const [partyname, setPartyname] = useState("");
  const [detail, setDetail] = useState("");

  const [myPosition, setMyPosition] = useState("ผู้รักษาประตู");

  const [positions, setPositions] = useState({
    goalkeeper: "",
    forward: "",
    midfielder: "",
    defender: "",
  });

  const [loading, setLoading] = useState(false);

  // ==============================
  // Load user
  // ==============================
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data?.data || null);
      } catch (err) {
        console.error("❌ โหลดข้อมูลผู้ใช้ล้มเหลว:", err);
      }
    };

    loadUser();
  }, []);

  // ==============================
  // Load field
  // ==============================
  useEffect(() => {
    const loadField = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/fields/${fieldId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setFieldData(res.data?.data || null);
      } catch (err) {
        console.error("❌ โหลดข้อมูลสนามล้มเหลว:", err);
      }
    };

    if (fieldId) loadField();
  }, [fieldId]);

  // ==============================
  // Preview Image
  // ==============================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImage) URL.revokeObjectURL(previewImage);

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // ==============================
  // Validate
  // ==============================
  const validate = () => {
    if (!partyname.trim()) return alert("กรุณากรอกชื่อปาร์ตี้"), false;
    if (!time) return alert("กรุณาเลือกเวลา"), false;
    if (!hours || Number(hours) <= 0) return alert("กรุณาระบุชั่วโมง"), false;
    if (!price || Number(price) <= 0) return alert("กรุณาระบุราคา"), false;

    const total =
      Number(positions.goalkeeper || 0) +
      Number(positions.forward || 0) +
      Number(positions.midfielder || 0) +
      Number(positions.defender || 0);

    if (total === 0) return alert("กรุณาเลือกตำแหน่งอย่างน้อย 1"), false;

    return true;
  };

  // ==============================
  // Convert Positions → Backend
  // ==============================
  const convertPositions = () => {
    const map = {
      goalkeeper: "GK",
      forward: "FW",
      midfielder: "MF",
      defender: "DF",
    };
    return Object.entries(positions)
      .filter(([_, v]) => v !== "" && Number(v) > 0)
      .map(([k, v]) => ({ position: map[k], amount: Number(v) }));
  };

  const convertMyPos = (p) => {
    if (p === "ผู้รักษาประตู") return "GK";
    if (p === "กองหน้า") return "FW";
    if (p === "กองกลาง") return "MF";
    return "DF";
  };

  // ==============================
  // CREATE PARTY
  // ==============================
  const handleCreate = async () => {
    try {
      if (!userData) return alert("โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
      if (!validate()) return;

      const token = localStorage.getItem("token");
      if (!token) return alert("กรุณาเข้าสู่ระบบ");

      setLoading(true);

      const start = new Date(`${selectedDate}T${time}`);
      const end = new Date(start.getTime() + Number(hours) * 3600 * 1000);

      const totalPlayers =
        Number(positions.goalkeeper || 0) +
        Number(positions.forward || 0) +
        Number(positions.midfielder || 0) +
        Number(positions.defender || 0);

      const form = new FormData();
      form.append("party_name", partyname);
      form.append("mode", "fixed");
      form.append("start_datetime", start.toISOString());
      form.append("end_datetime", end.toISOString());
      form.append("price", Number(price));
      form.append("description", detail || "");
      form.append("total_required_players", totalPlayers);

      // Field
      form.append("field_id", fieldId);
      form.append("field_name", fieldData?.field_name || "");
      form.append("address", fieldData?.address || "");
      form.append("google_map", fieldData?.google_map || "");

      // User Info — FIXED
      form.append("user_id", userData._id); // ⭐ ต้องส่ง!
      form.append("username", userData.username || "");
      form.append("host_image", userData.profile_photo || "");
      form.append("position", convertMyPos(myPosition)); // ส่งตำแหน่งถูกแล้ว

      // Image
      if (image) form.append("image", image);

      // Required positions
      form.append("required_positions", JSON.stringify(convertPositions()));

      await axios.post(`${API}/api/create-post/${fieldId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLoading(false);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("❌ ERROR:", err);
      setLoading(false);
      alert("เกิดข้อผิดพลาด");
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div className="font-noto-thai flex flex-col items-center pb-24">
      {/* Header */}
      <div className="relative w-[24.5rem] h-[10rem] ">
        <button
          onClick={() =>
            navigate(`/findandcreate/${fieldId}?date=${selectedDate}`)
          }
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
        >
          <FaArrowLeft className="text-green-600 text-lg" />
        </button>

        <img src={findparty} className="w-full h-full object-cover" />
      </div>

      {/* Body */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4">
        <h2 className="text-black font-bold text-2xl">
          {fieldData?.field_name}
        </h2>
        <p className="text-gray-600 text-sm mb-2 mt-1">{fieldData?.address}</p>

        {/* DATE (REACT DATEPICKER POPUP) */}
        <div className="w-full bg-green-500 text-white rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
          {/* Calendar icon */}
          <FiCalendar
            className="text-white text-xl cursor-pointer"
            onClick={() => {
              const picker = document.getElementById("popupCalendar2");
              if (picker) picker.setFocus(true);
            }}
          />

          <DatePicker
            id="popupCalendar2"
            selected={new Date(selectedDate)}
            onChange={(d) => {
              const formatted = d.toISOString().split("T")[0];
              setSelectedDate(formatted); // ⭐ ส่งไป backend ได้เหมือน input แบบเดิม
            }}
            dateFormat="yyyy-MM-dd"
            className="bg-transparent text-white font-semibold text-sm outline-none w-full"
            calendarClassName="rounded-xl shadow-lg border bg-white"
            popperPlacement="bottom"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() =>
              navigate(`/findandcreate/${fieldId}?date=${selectedDate}`)
            }
            className="flex-1 bg-white border border-green-500 text-green-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-50"
          >
            ค้นหาปาร์ตี้
          </button>

          <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
            สร้างปาร์ตี้
          </button>
        </div>

        {/* MODE */}
        <h2 className="font-semibold text-lg mb-2">โหมด</h2>

        <div className="flex gap-4 justify-center mb-6">
          <div
            onClick={() =>
              navigate(`/create-party/${fieldId}?date=${selectedDate}`)
            }
            className="w-40 h-40 rounded-xl p-2 cursor-pointer flex flex-col items-center justify-center border border-gray-300 bg-white"
          >
            <img src={buffetImg} className="max-h-28" />
            <p className="mt-1">บุฟเฟ่ต์</p>
          </div>

          <div className="w-40 h-40 rounded-xl p-2 cursor-pointer flex flex-col items-center justify-center border border-green-500 bg-green-100">
            <img src={lockImg} className="max-h-28" />
            <p className="mt-1">ล็อคตำแหน่ง</p>
          </div>
        </div>

        {/* TIME */}
        <p className="text-gray-700 font-semibold mb-1">เวลาเริ่มแข่ง</p>
        <div className="border rounded-xl px-3 py-3 mb-4 bg-white">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* HOURS + PRICE */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="font-semibold text-gray-700">จำนวนชั่วโมง</p>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full border rounded-xl p-3 bg-white mt-1"
              placeholder="1 ชั่วโมง"
            />
          </div>

          <div>
            <p className="font-semibold text-gray-700">ราคา (บาท/คน)</p>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-xl p-3 bg-white mt-1"
              placeholder="เช่น 100"
            />
          </div>
        </div>

        {/* PARTY NAME */}
        <p className="font-semibold">ชื่อปาร์ตี้</p>
        <input
          type="text"
          value={partyname}
          onChange={(e) => setPartyname(e.target.value)}
          className="border rounded-xl p-3 bg-white w-full mb-4"
          placeholder="Young Nai Party"
        />

        {/* DETAIL */}
        <p className="font-semibold">รายละเอียด</p>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          maxLength={200}
          className="w-full border rounded-xl p-3 bg-white h-28 mt-1 outline-none"
          placeholder="รายละเอียด (ไม่เกิน 200 ตัวอักษร)"
        />

        {/* IMAGE + MY POSITION */}
        <div className="grid grid-cols-2 gap-4 my-6">
          <div>
            <p className="font-semibold">รูปภาพปก</p>
            <label className="bg-white block border border-green-500 p-2 rounded-xl cursor-pointer text-green-600 text-center mt-1 hover:bg-green-50">
              เลือกรูปภาพ
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {previewImage && (
              <img
                src={previewImage}
                className="w-full h-40 object-cover rounded-xl mt-3 border"
              />
            )}
          </div>

          <div>
            <p className="font-semibold">ตำแหน่งของคุณ</p>
            <select
              value={myPosition}
              onChange={(e) => setMyPosition(e.target.value)}
              className="border rounded-xl w-full p-2 bg-white mt-1"
            >
              <option>ผู้รักษาประตู</option>
              <option>กองหน้า</option>
              <option>กองกลาง</option>
              <option>กองหลัง</option>
            </select>
          </div>
        </div>

        {/* REQUIRED POSITIONS */}
        <h2 className="font-semibold text-lg mb-2">ตำแหน่งที่ต้องการ</h2>

        <div className="grid grid-cols-2 gap-4">
          <PositionBox
            title="ผู้รักษาประตู"
            img={GK}
            value={positions.goalkeeper}
            onChange={(v) =>
              setPositions((prev) => ({ ...prev, goalkeeper: v }))
            }
          />

          <PositionBox
            title="กองหน้า"
            img={FW}
            value={positions.forward}
            onChange={(v) => setPositions((prev) => ({ ...prev, forward: v }))}
          />

          <PositionBox
            title="กองกลาง"
            img={MF}
            value={positions.midfielder}
            onChange={(v) =>
              setPositions((prev) => ({ ...prev, midfielder: v }))
            }
          />

          <PositionBox
            title="กองหลัง"
            img={DF}
            value={positions.defender}
            onChange={(v) => setPositions((prev) => ({ ...prev, defender: v }))}
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-500 text-white font-bold text-lg py-3 rounded-xl w-full mt-8"
        >
          {loading ? "กำลังสร้าง..." : "สร้างปาร์ตี้"}
        </button>
      </div>

{showSuccessPopup && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="w-80 bg-white/90 backdrop-blur-xl rounded-3xl p-6 text-center shadow-2xl animate-fadeScale border border-white/30">
      
      {/* Success Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pop">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
        สร้างปาร์ตี้สำเร็จ!
      </h2>

      <p className="text-gray-600 mb-5">
        ทีมของคุณพร้อมแล้ว — ผู้เล่นสามารถเข้าร่วมได้เลย
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setShowSuccessPopup(false)}
          className="flex-1 bg-white border border-gray-200 text-gray-800 py-2 rounded-xl font-medium"
        >
          ปิด
        </button>

        <button
          onClick={() =>
            navigate(`/findandcreate/${fieldId}?date=${selectedDate}`)
          }
          className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold"
        >
          ไปที่ปาร์ตี้
        </button>
      </div>
    </div>
  </div>
)}

      <BottomNav />
    </div>
  );
}

// =============================
// Component: PositionBox
// =============================
function PositionBox({ title, img, value, onChange }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center">
      <img src={img} className="h-14 mb-2" />
      <p className="font-semibold">{title}</p>

      <input
        type="text"
        className="border border-green-500 rounded-full text-center w-20 py-1 mt-2"
        value={value === "" ? "" : value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "" || /^\d+$/.test(v)) onChange(v);
        }}
      />

      <p className="text-gray-500 text-sm mt-1">คน</p>
    </div>
  );
}
