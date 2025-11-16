// =====================
//  CreateParty.jsx (COMPLETE VERSION WITH USER_ID + react-datepicker FIX)
// =====================

import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import findparty from "../../public/party2.png";
import Buffetpic from "../../public/buffetpic.png";
import LP from "../../public/lockposition.png";
import BottomNav from "./Navbar";

const API = "http://172.20.10.4:3000";

export default function CreateParty() {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [query] = useSearchParams();

  // STATE
  const [date, setDate] = useState(
    query.get("date") || new Date().toISOString().split("T")[0]
  ); // stored as 'YYYY-MM-DD' string
  const [time, setTime] = useState("");
  const [hours, setHours] = useState("");
  const [price, setPrice] = useState("");
  const [partyname, setPartyname] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [detail, setDetail] = useState("");

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [fieldData, setFieldData] = useState(null);
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(false);

  // ref for datepicker to programmatically open
  const datePickerRef = useRef(null);

  // ===========================
  // Load user profile
  // ===========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data?.data || null);
      } catch (err) {
        console.error("❌ Load user error:", err);
      }
    };

    fetchUser();
  }, []);

  // ===========================
  // Load field data
  // ===========================
  useEffect(() => {
    const fetchField = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/fields/${fieldId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setFieldData(res.data?.data || null);
      } catch (err) {
        console.error("❌ Error fetching field:", err);
      }
    };

    if (fieldId) fetchField();
  }, [fieldId]);

  // ===========================
  // Preview picture
  // ===========================
  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setImage(null);
      setPreviewUrl(null);
      return;
    }

    setImage(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // ===========================
  // Create party
  // ===========================
  const handleCreate = async () => {
    try {
      if (!userData) return alert("โหลดข้อมูลผู้ใช้ล้มเหลว");

      const token = localStorage.getItem("token");
      if (!token) return alert("กรุณาเข้าสู่ระบบ");

      if (!partyname || !time || !hours || !price || !date)
        return alert("กรุณากรอกข้อมูลให้ครบ");

      if (!playerCount || Number(playerCount) <= 0)
        return alert("กรุณาระบุจำนวนผู้เล่น");

      const start = new Date(`${date}T${time}`);
      const end = new Date(start.getTime() + Number(hours) * 3600 * 1000);

      setLoading(true);

      const formData = new FormData();
      formData.append("party_name", partyname);
      formData.append("mode", "flexible");
      formData.append("description", detail || "");
      formData.append("start_datetime", start.toISOString());
      formData.append("end_datetime", end.toISOString());
      formData.append("price", Number(price));
      formData.append("total_required_players", Number(playerCount));

      // ===========================
      // Field Info
      // ===========================
      formData.append("field_id", fieldId);
      formData.append("field_name", fieldData?.field_name || "");
      formData.append("address", fieldData?.address || "");
      formData.append("google_map", fieldData?.google_map || "");

      // ===========================
      // ⭐⭐ USER INFO (สำคัญมาก) ⭐⭐
      // ===========================
      formData.append("user_id", userData._id);
      formData.append("username", userData.username || "");
      formData.append("user_image", userData.profile_image || "");

      // Image
      if (image) formData.append("image", image);

      const res = await axios.post(
        `${API}/api/create-post/${fieldId}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);

      if (res.data?.status === "success") {
        alert("สร้างปาร์ตี้สำเร็จ!");
        navigate(`/findandcreate/${fieldId}?date=${date}`);
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (err) {
      console.error("❌ Create party error:", err);
      setLoading(false);
      alert("เกิดข้อผิดพลาด");
    }
  };

  // ===========================
  // UI
  // ===========================
  return (
    <div className="flex flex-col items-center font-noto-thai pb-20">
      {/* Header */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <button
          onClick={() => navigate("/FindCreateParty")}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
        >
          <FaArrowLeft className="text-green-600 text-lg" />
        </button>

        <img src={findparty} className="w-full h-full object-cover" />
      </div>

      {/* Body */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4">
        <h2 className="text-black font-bold text-2xl">
          {fieldData?.field_name || "สนามฟุตบอล"}
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          {fieldData?.address || "-"}
        </p>

        {/* DATE (REACT DATEPICKER POPUP) */}
        <div className="w-full bg-green-500 text-white rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
          {/* Calendar icon */}
          <FiCalendar
            className="text-white text-xl cursor-pointer"
            onClick={() => {
              if (datePickerRef.current && typeof datePickerRef.current.setOpen === "function") {
                datePickerRef.current.setOpen(true);
              } else {
                // fallback: focus the input inside datepicker
                const el = document.querySelector('#popupCalendar input');
                if (el) el.focus();
              }
            }}
          />

          <DatePicker
            id="popupCalendar"
            ref={datePickerRef}
            selected={date ? new Date(date) : null}
            onChange={(d) => {
              if (!d) return;
              const formatted = d.toISOString().split("T")[0]; // YYYY-MM-DD
              setDate(formatted); // still string for backend compatibility
            }}
            dateFormat="yyyy-MM-dd"
            className="bg-transparent text-white font-semibold text-sm outline-none w-full"
            calendarClassName="rounded-xl shadow-lg border bg-white"
            popperPlacement="bottom"
            placeholderText="เลือกวันที่"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 my-4">
          <button
            onClick={() => navigate(`/findandcreate/${fieldId}?date=${date}`)}
            className="bg-white flex-1 border border-green-500 text-green-600 py-2 rounded-xl font-bold"
          >
            ค้นหาปาร์ตี้
          </button>

          <button
            onClick={handleCreate}
            className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold"
          >
            สร้างปาร์ตี้
          </button>
        </div>

        {/* Mode */}
        <h2 className="font-semibold text-lg mb-2">โหมด</h2>
        <div className="flex gap-4 justify-center mb-5">
          <div className="w-40 h-40 border border-green-500 bg-green-100 rounded-xl flex flex-col items-center justify-center">
            <img src={Buffetpic} className="max-h-28" />
            <p>บุฟเฟ่ต์</p>
          </div>

          <div
            onClick={() => navigate(`/create-party2/${fieldId}?date=${date}`)}
            className="w-40 h-40 border border-gray-300 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer"
          >
            <img src={LP} className="max-h-28" />
            <p>ล็อคตำแหน่ง</p>
          </div>
        </div>

        {/* Time */}
        <p className="font-semibold">เวลาเริ่มแข่ง</p>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border rounded-xl p-3 bg-white my-2"
        />

        {/* Hours + Price */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <input
            type="number"
            placeholder="ชั่วโมง"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="border rounded-xl p-3 bg-white"
          />

          <input
            type="number"
            placeholder="ราคา"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded-xl p-3 bg-white"
          />
        </div>

        {/* Party Name + Player Count */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <input
            type="text"
            placeholder="ชื่อปาร์ตี้"
            value={partyname}
            onChange={(e) => setPartyname(e.target.value)}
            className="border rounded-xl p-3 bg-white"
          />

          <input
            type="number"
            placeholder="จำนวนผู้เล่น"
            value={playerCount}
            onChange={(e) => setPlayerCount(e.target.value)}
            className="border rounded-xl p-3 bg-white"
          />
        </div>

        {/* Detail */}
        <textarea
          className="w-full border rounded-xl p-3 bg-white h-28"
          placeholder="รายละเอียด"
          maxLength={200}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />

        {/* Image */}
        <div className="mt-6">
          <label className="font-semibold block mb-2">รูปภาพปก</label>

          <label
            htmlFor="imgInput"
            className="bg-white border border-green-500 px-5 py-2 rounded-xl text-green-600 cursor-pointer inline-block hover:bg-green-50"
          >
            เลือกรูปภาพ
          </label>

          <input
            id="imgInput"
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />

          {previewUrl && (
            <img
              src={previewUrl}
              className="w-full h-40 object-cover rounded-xl mt-4 border"
            />
          )}
        </div>

        {/* Submit (duplicate button removed above; kept here just in case) */}
        <div className="mt-4">
          <button
            onClick={handleCreate}
            className="mt-5 bg-green-500 text-white w-full py-3 rounded-xl font-bold text-lg"
          >
            {loading ? "กำลังสร้าง..." : "สร้างปาร์ตี้"}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
