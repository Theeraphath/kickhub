// src/components/CreateParty2.jsx
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import defaultHeader from "../../public/party2.png";
import buffetImg from "../../public/buffetpic.png";
import lockImg from "../../public/lockposition.png";

import GK from "../../public/ประตู.png";
import FW from "../../public/กองหน้า.png";
import MF from "../../public/กองกลาง.png";
import DF from "../../public/กองหลัง.png";

import BottomNav from "./Navbar";

const API = "http://172.20.10.4:3000";


export default function CreateParty2() {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [query] = useSearchParams();

  // ------------------ STATE ------------------
  const [fieldData, setFieldData] = useState(null);

  const [mode, setMode] = useState("ล็อคตำแหน่ง");
  const [selectedDate, setSelectedDate] = useState(
    query.get("date") || new Date().toISOString().split("T")[0]
  );

  const [previewImage, setPreviewImage] = useState(null);

  const [time, setTime] = useState("");
  const [hours, setHours] = useState("");
  const [price, setPrice] = useState("");
  const [partyname, setPartyname] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState(null);

  const [myPosition, setMyPosition] = useState("ผู้รักษาประตู");

  const [positions, setPositions] = useState({
    goalkeeper: 0,
    forward: 0,
    midfielder: 0,
    defender: 0,
  });

  const [loading, setLoading] = useState(false);

  // ------------------ LOAD FIELD DATA ------------------
  useEffect(() => {
    const loadField = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/fields/${fieldId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setFieldData(res.data?.data || null);
      } catch (err) {
        console.error("โหลดข้อมูลสนามล้มเหลว:", err);
      }
    };

    if (fieldId) loadField();
  }, [fieldId]);

  const getHeaderImage = () => {
    if (!fieldData?.image) return defaultHeader;
    return `${API}/${fieldData.image.replace(/\\/g, "/")}`;
  };

  // ------------------ IMAGE UPLOAD ------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImage) URL.revokeObjectURL(previewImage);

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // ------------------ POSITION CHANGES ------------------
  const handlePositionChange = (key, value) => {
    setPositions((prev) => ({
      ...prev,
      [key]: Math.max(0, Number(value) || 0),
    }));
  };

  const convertPositionsToRequired = () => {
    const map = {
      goalkeeper: "GK",
      forward: "FW",
      midfielder: "MF",
      defender: "DF",
    };

    return Object.entries(positions)
      .filter(([k, v]) => v > 0)
      .map(([k, v]) => ({ position: map[k], amount: v }));
  };

  // ------------------ VALIDATION ------------------
  const validate = () => {
    if (!partyname.trim()) return alert("กรุณากรอกชื่อปาร์ตี้"), false;
    if (!time) return alert("กรุณาเลือกเวลาเริ่ม"), false;
    if (!hours || Number(hours) <= 0)
      return alert("กรุณาระบุจำนวนชั่วโมง"), false;
    if (!price || Number(price) <= 0) return alert("กรุณาระบุราคา"), false;

    if (mode === "ล็อคตำแหน่ง") {
      const sum = Object.values(positions).reduce((a, b) => a + b, 0);
      if (sum === 0) return alert("กรุณาระบุตำแหน่งอย่างน้อย 1 ตำแหน่ง"), false;
    }

    return true;
  };

  // ------------------ CREATE PARTY (POST) ------------------
  const handleCreate = async () => {
    try {
      if (!validate()) return;

      const token = localStorage.getItem("token");
      if (!token) return alert("กรุณาเข้าสู่ระบบ");

      setLoading(true);

      const start = new Date(`${selectedDate}T${time}`);
      const end = new Date(start.getTime() + Number(hours) * 3600 * 1000);

      const form = new FormData();
      form.append("party_name", partyname);
      form.append("mode", "fixed");
      form.append("start_datetime", start.toISOString());
      form.append("end_datetime", end.toISOString());
      form.append("price", Number(price));
      form.append("description", detail || "");

      form.append("field_name", fieldData?.field_name || "");
      form.append("address", fieldData?.address || "");
      form.append("google_map", fieldData?.google_map || "");

      if (image) form.append("image", image);

      form.append(
        "required_positions",
        JSON.stringify(convertPositionsToRequired())
      );

      const res = await axios.post(`${API}/api/create-post/${fieldId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLoading(false);

      alert("สร้างปาร์ตี้สำเร็จ!");
      navigate(`/findandcreate/${fieldId}?date=${selectedDate}`);
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="font-noto-thai flex flex-col items-center pb-24">
      {/* HEADER */}
      <div className="relative w-[24.5rem] h-[10rem] mb-2">
        <button
          onClick={() => navigate("/FindCreateParty")}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
        >
          <FaArrowLeft className="text-green-600 text-lg" />
        </button>

        <img src={getHeaderImage()} className="w-full h-full object-cover" />
      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4">
        <h2 className="text-black font-bold text-2xl">
          {fieldData?.field_name}
        </h2>
        <p className="text-gray-600 text-sm mb-2 mt-1">{fieldData?.address}</p>

        {/* DATE */}
        <div className="w-full bg-green-500 text-white rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
          <span>📅</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white font-semibold text-sm w-full outline-none"
          />
        </div>

        {/* SEARCH + CREATE */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() =>
              navigate(`/findandcreate/${fieldId}?date=${selectedDate}`)
            }
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
            onClick={() =>
              navigate(`/create-party/${fieldId}?date=${selectedDate}`)
            }
            className="w-40 h-40 rounded-xl p-2 cursor-pointer flex flex-col items-center justify-center border border-gray-300 bg-white"
          >
            <img src={buffetImg} className="max-h-28" alt="buffet" />
            <p className="mt-1">บุฟเฟ่ต์</p>
          </div>

          {/* ล็อคตำแหน่ง */}
          <div className="w-40 h-40 rounded-xl p-2 cursor-pointer flex flex-col items-center justify-center border border-green-500 bg-green-100">
            <img src={lockImg} className="max-h-28" alt="lock mode" />
            <p className="mt-1">ล็อคตำแหน่ง</p>
          </div>
        </div>

        <p className="text-gray-700 font-semibold mb-1">เวลาเริ่มเตะหรือจอง</p>
        <div className="border rounded-xl px-3 py-3 mb-4 bg-white flex items-center">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full outline-none"
          />
        </div>

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

        {/* PARTY NAME */}
        <p className="font-semibold">ชื่อปาร์ตี้</p>
        <input
          type="text"
          value={partyname}
          onChange={(e) => setPartyname(e.target.value)}
          className="border rounded-xl p-3 bg-white w-full mb-4"
          placeholder="Young Nai Party"
        />

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
            <label className="block border border-green-500 p-2 rounded-xl cursor-pointer text-green-600 text-center mt-1">
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
            <p className="font-semibold">ตำแหน่งตัวเอง</p>
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
            onChange={(v) => handlePositionChange("goalkeeper", v)}
          />
          <PositionBox
            title="กองหน้า"
            img={FW}
            value={positions.forward}
            onChange={(v) => handlePositionChange("forward", v)}
          />
          <PositionBox
            title="กองกลาง"
            img={MF}
            value={positions.midfielder}
            onChange={(v) => handlePositionChange("midfielder", v)}
          />
          <PositionBox
            title="กองหลัง"
            img={DF}
            value={positions.defender}
            onChange={(v) => handlePositionChange("defender", v)}
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

      <BottomNav />
    </div>
  );
}

// POSITION BOX COMPONENT
function PositionBox({ title, img, value, onChange }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center">
      <img src={img} className="h-14 mb-2" />
      <p className="font-semibold">{title}</p>

      <input
        type="number"
        min="0"
        className="border border-green-500 rounded-full text-center w-20 py-1 mt-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <p className="text-gray-500 text-sm mt-1">คน</p>
    </div>
  );
}
