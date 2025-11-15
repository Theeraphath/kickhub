// src/components/CreateParty.jsx
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import findparty from "../../public/party2.png";
import Buffetpic from "../../public/buffetpic.png";
import LP from "../../public/lockposition.png";
import BottomNav from "./Navbar";

const API = "http://172.20.10.4:3000";

export default function CreateParty() {
  const navigate = useNavigate();
  const { fieldId } = useParams();

  const [mode, setMode] = useState("บุฟเฟ่ต์"); // flexible mode
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [hours, setHours] = useState("");
  const [price, setPrice] = useState("");
  const [partyname, setPartyname] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------
  // โหลดข้อมูลสนามจาก backend
  // ----------------------------------------------------
  useEffect(() => {
    const fetchField = async () => {
      try {
        if (!fieldId) return;
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/fields/${fieldId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setFieldData(res.data?.data || null);
      } catch (err) {
        console.error("Error fetching field:", err);
      }
    };
    fetchField();
  }, [fieldId]);

  const getImageUrl = (img) => {
    if (!img) return findparty;
    return `${API_BASE}/${img.replace(/\\/g, "/")}`;
  };

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setImage(null);
      setPreviewUrl(null);
      return;
    }
    setImage(f);
    // preview
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  // cleanup preview URL on unmount / new file
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ----------------------------------------------------
  // กด "สร้างปาร์ตี้"
  // ----------------------------------------------------
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("กรุณาเข้าสู่ระบบ");

      // basic validation
      if (!partyname || !time || !hours || !price || !date) {
        return alert("กรุณากรอกข้อมูลให้ครบ");
      }
      if (mode === "บุฟเฟ่ต์" && (!playerCount || Number(playerCount) <= 0)) {
        return alert("กรุณาระบุจำนวนผู้เล่นสำหรับโหมดบุฟเฟ่ต์");
      }

      const start = new Date(`${date}T${time}`);
      if (isNaN(start.getTime())) {
        return alert("รูปแบบวันที่/เวลาไม่ถูกต้อง");
      }
      const end = new Date(start.getTime() + Number(hours) * 3600 * 1000);

      const form = new FormData();
      form.append("party_name", partyname);
      form.append("mode", mode === "บุฟเฟ่ต์" ? "flexible" : "fixed");
      form.append("start_datetime", start.toISOString());
      form.append("end_datetime", end.toISOString());
      form.append("price", Number(price));
      form.append("description", detail || "");

      if (mode === "บุฟเฟ่ต์") {
        form.append("total_required_players", Number(playerCount));
      }

      // include field metadata
      form.append("field_name", fieldData?.field_name || "");
      form.append("address", fieldData?.address || "");
      form.append("google_map", fieldData?.google_map || "");

      if (image) {
        form.append("image", image, image.name);
      }

      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/create-post/${fieldId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          // axios will set Content-Type for FormData
        },
      });
      setLoading(false);

      if (res.data?.status === "success" || res.status === 201 || res.status === 200) {
        alert("สร้างปาร์ตี้สำเร็จ!");
        navigate(`/findandcreate/${fieldId}?date=${date}`);
      } else {
        console.error("create failed:", res.data);
        alert("เกิดข้อผิดพลาดขณะสร้างปาร์ตี้");
      }
    } catch (err) {
      setLoading(false);
      console.error("Error creating post:", err);
      const msg = err?.response?.data?.message || err.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์";
      alert("เกิดข้อผิดพลาด: " + msg);
    }
  };

  return (
    <div className="flex flex-col items-center font-noto-thai pb-20">
      {/* HEADER */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <button
          onClick={() => navigate("/FindCreateParty")}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
        >
          <FaArrowLeft className="text-green-600 text-lg" />
        </button>

        <img
          src={getImageUrl(fieldData?.image)}
          className="w-full h-full object-cover"
          alt="field header"
        />
      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        {/* FIELD NAME */}
        <h2 className="text-black font-bold text-2xl">
          {fieldData?.field_name || "สนามฟุตบอล"}
        </h2>
        <p className="text-gray-600 text-sm mb-2 mt-1">{fieldData?.address || "-"}</p>

        {/* DATE */}
        <div className="w-full bg-green-500 text-white rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
          <span>📅</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-white font-semibold text-sm w-full outline-none"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate(`/findandcreate/${fieldId}?date=${date}`)}
            className="flex-1 bg-white border border-green-500 text-green-600 px-4 py-2 rounded-xl text-sm font-bold"
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
          {/* บุฟเฟ่ต์ */}
          <div
            onClick={() => setMode("บุฟเฟ่ต์")}
            className={`w-40 h-40 rounded-xl p-2 cursor-pointer flex flex-col items-center justify-center border
            ${mode === "บุฟเฟ่ต์" ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"}`}
          >
            <img src={Buffetpic} className="max-h-28" alt="buffet" />
            <p className="mt-1">บุฟเฟ่ต์</p>
          </div>

          {/* ล็อคตำแหน่ง */}
          <div
            onClick={() => navigate(`/create-party2/${fieldId}?date=${date}`)}
            className="w-40 h-40 rounded-xl p-2 cursor-pointer flex flex-col items-center justify-center border border-gray-300 bg-white"
          >
            <img src={LP} className="max-h-28" alt="lock pos" />
            <p className="mt-1">ล็อคตำแหน่ง</p>
          </div>
        </div>

        {/* TIME */}
        <p className="text-gray-700 font-semibold mb-1">เวลาเริ่มเตะหรือจอง</p>
        <div className="border rounded-xl px-3 py-3 mb-4 bg-white flex items-center">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* HOURS & PRICE */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="font-semibold text-gray-700">จำนวนชั่วโมง</p>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full border rounded-xl p-3 bg-white mt-1 outline-none"
              placeholder="1 ชั่วโมง"
            />
          </div>

          <div>
            <p className="font-semibold text-gray-700">ราคา (บาท/คน)</p>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-xl p-3 bg-white mt-1 outline-none"
              placeholder="เช่น 100 บาท"
            />
          </div>
        </div>

        {/* PARTY NAME + PLAYER COUNT */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="font-semibold">ชื่อปาร์ตี้</p>
            <input
              type="text"
              value={partyname}
              onChange={(e) => setPartyname(e.target.value)}
              className="w-full border rounded-xl p-3 bg-white mt-1 outline-none"
              placeholder="ชื่อปาร์ตี้"
            />
          </div>

          <div>
            <p className="font-semibold">จำนวนผู้เล่น</p>
            <input
              type="number"
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
              className="w-full border rounded-xl p-3 bg-white mt-1 outline-none"
              placeholder="จำนวนคนที่ต้องการเพิ่ม"
            />
          </div>
        </div>

        {/* DETAIL */}
        <p className="font-semibold">รายละเอียด</p>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          maxLength={200}
          className="w-full border rounded-xl p-3 bg-white h-28 mt-1 outline-none"
          placeholder="รายละเอียด (ไม่เกิน 200 ตัวอักษร)"
        />

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="text-base font-semibold text-black block mb-2">
            รูปภาพปก
          </label>

          <label
            htmlFor="partyImage"
            className="inline-block border border-green-500 text-green-600 font-semibold px-5 py-2 rounded-xl cursor-pointer hover:bg-green-50 transition"
          >
            เลือกรูปภาพ
          </label>

          <input
            id="partyImage"
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />

          {image && <p className="mt-2 text-sm text-gray-600">{image.name}</p>}

          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full h-40 object-cover rounded-xl mt-3 border"
            />
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-500 text-white w-full py-3 rounded-lg text-lg font-semibold"
        >
          {loading ? "กำลังสร้าง..." : "สร้างปาร์ตี้"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
