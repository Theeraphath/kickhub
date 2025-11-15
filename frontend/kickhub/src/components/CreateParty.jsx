// src/components/CreateParty.jsx

import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

import findparty from "../../public/party2.png";
import Buffetpic from "../../public/buffetpic.png";
import LP from "../../public/lockposition.png";
import BottomNav from "./Navbar";

const API = "http://172.20.10.4:3000";

export default function CreateParty() {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [query] = useSearchParams();

  // ---------------- STATE ----------------
  const [mode] = useState("บุฟเฟ่ต์");
  const [date, setDate] = useState(
    query.get("date") || new Date().toISOString().split("T")[0]
  );
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

  // ---------------- โหลดข้อมูลสนาม ----------------
  useEffect(() => {
    const fetchField = async () => {
      try {
        if (!fieldId) return;
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/fields/${fieldId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setFieldData(res.data?.data || null);
      } catch (err) {
        console.error("❌ Error fetching field:", err);
      }
    };

    fetchField();
  }, [fieldId]);

  // ---------------- Preview รูป ----------------
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

  // ---------------- สร้างปาร์ตี้ ----------------
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("กรุณาเข้าสู่ระบบ");

      if (!partyname || !time || !hours || !price || !date) {
        return alert("กรุณากรอกข้อมูลให้ครบ");
      }

      if (!playerCount || Number(playerCount) <= 0) {
        return alert("กรุณาระบุจำนวนผู้เล่น");
      }

      const start = new Date(`${date}T${time}`);
      if (isNaN(start.getTime())) return alert("รูปแบบวันที่/เวลาไม่ถูกต้อง");

      const end = new Date(start.getTime() + Number(hours) * 3600 * 1000);

      setLoading(true);

      // 📌 ส่งแบบ multipart/form-data
      const formData = new FormData();
      formData.append("party_name", partyname);
      formData.append("mode", "flexible");
      formData.append("description", detail || "");
      formData.append("start_datetime", start.toISOString());
      formData.append("end_datetime", end.toISOString());
      formData.append("price", Number(price));
      formData.append("total_required_players", Number(playerCount));

      formData.append("field_id", fieldId);
      formData.append("field_name", fieldData?.field_name || "");
      formData.append("address", fieldData?.address || "");
      formData.append("google_map", fieldData?.google_map || "");

      // 📌 backend จะเก็บ filename เอง
      if (image) formData.append("image", image);

      const res = await axios.post(`${API}/api/create-post/${fieldId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLoading(false);

      if (res.data?.status === "success") {
        alert("สร้างปาร์ตี้สำเร็จ!");
        navigate(`/findandcreate/${fieldId}?date=${date}`);
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setLoading(false);
      console.error("❌ Error creating post:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="flex flex-col items-center font-noto-thai pb-20">

      {/* HEADER — ใช้รูปจาก public เท่านั้น */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <button
          onClick={() => navigate("/FindCreateParty")}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
        >
          <FaArrowLeft className="text-green-600 text-lg" />
        </button>

        <img src={findparty} className="w-full h-full object-cover" />
      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4">

        <h2 className="text-black font-bold text-2xl">
          {fieldData?.field_name || "สนามฟุตบอล"}
        </h2>
        <p className="text-gray-600 text-sm mb-2 mt-1">
          {fieldData?.address || "-"}
        </p>

        {/* DATE PICKER */}
        <div className="w-full bg-green-500 text-white rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
          <span>📅</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-white font-semibold text-sm w-full outline-none"
          />
        </div>

        {/* Buttons */}
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
          <div className="w-40 h-40 rounded-xl p-2 border border-green-500 bg-green-100 flex flex-col items-center justify-center">
            <img src={Buffetpic} className="max-h-28" />
            <p className="mt-1">บุฟเฟ่ต์</p>
          </div>

          <div
            onClick={() => navigate(`/create-party2/${fieldId}?date=${date}`)}
            className="w-40 h-40 rounded-xl p-2 border border-gray-300 bg-white flex flex-col items-center justify-center cursor-pointer"
          >
            <img src={LP} className="max-h-28" />
            <p className="mt-1">ล็อคตำแหน่ง</p>
          </div>
        </div>

        {/* TIME */}
        <p className="text-gray-700 font-semibold mb-1">เวลาเริ่มแข่ง</p>
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
              placeholder="เช่น 100"
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
              placeholder="จำนวนคน"
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
          placeholder="รายละเอียด (ไม่เกิน 200 ตัว)"
        />

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="text-base font-semibold block mb-2">
            รูปภาพปก
          </label>

          <label
            htmlFor="partyImage"
            className="bg-white border border-green-500 text-green-600 px-5 py-2 rounded-xl cursor-pointer hover:bg-green-50"
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

          {image && <p className="mt-2 text-sm">{image.name}</p>}

          {previewUrl && (
            <img
              src={previewUrl}
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
