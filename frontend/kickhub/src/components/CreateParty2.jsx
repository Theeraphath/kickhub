// src/components/CreateParty2.jsx

import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import findparty from "../../public/party2.png";
import buffetImg from "../../public/buffetpic.png";
import lockImg from "../../public/lockposition.png";

import GK from "../../public/ประตู.png";
import FW from "../../public/กองหน้า.png";
import MF from "../../public/กองกลาง.png";
import DF from "../../public/กองหลัง.png";

import BottomNav from "./Navbar";

import { API } from "../config";

export default function CreateParty2() {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [query] = useSearchParams();

  // --------------------- STATE ---------------------
  const [fieldData, setFieldData] = useState(null);

  const [mode] = useState("ล็อคตำแหน่ง");
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

  // required positions (เป็น string เพื่อให้ลบได้)
  const [positions, setPositions] = useState({
    goalkeeper: "",
    forward: "",
    midfielder: "",
    defender: "",
  });

  const [loading, setLoading] = useState(false);

  // --------------------- โหลดข้อมูลสนาม ---------------------
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

  // --------------------- Preview รูป ---------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImage) URL.revokeObjectURL(previewImage);

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // --------------------- ป้องกันเลข 0, 00, 05 ---------------------
  const handlePositionChange = (key, value) => {
    // ล้างค่า
    if (value === "") {
      setPositions((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    // ป้องกันตัวอักษร
    if (!/^\d+$/.test(value)) return;

    // รับค่าเป็นตัวเลขธรรมดา
    setPositions((prev) => ({ ...prev, [key]: value }));
  };

  // --------------------- แปลงตำแหน่งส่ง backend ---------------------
  const convertPositionsToRequired = () => {
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

  // --------------------- Validate ---------------------
  const validate = () => {
    if (!partyname.trim()) return alert("กรุณากรอกชื่อปาร์ตี้"), false;
    if (!time) return alert("กรุณาเลือกเวลา"), false;
    if (!hours || Number(hours) <= 0)
      return alert("กรุณาระบุจำนวนชั่วโมง"), false;
    if (!price || Number(price) <= 0) return alert("กรุณาระบุราคา"), false;

    const sum =
      Number(positions.goalkeeper || 0) +
      Number(positions.forward || 0) +
      Number(positions.midfielder || 0) +
      Number(positions.defender || 0);

    if (sum === 0) return alert("กรุณาเลือกตำแหน่งอย่างน้อย 1 ตำแหน่ง"), false;

    return true;
  };

  // --------------------- ส่งข้อมูลสร้างปาร์ตี้ ---------------------
  const handleCreate = async () => {
    try {
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

      form.append("field_id", fieldId);
      form.append("field_name", fieldData?.field_name || "");
      form.append("address", fieldData?.address || "");
      form.append("google_map", fieldData?.google_map || "");

      if (image) form.append("image", image);

      form.append(
        "required_positions",
        JSON.stringify(convertPositionsToRequired())
      );

      await axios.post(`${API}/api/create-post/${fieldId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLoading(false);
      alert("สร้างปาร์ตี้สำเร็จ!");

      navigate(`/findandcreate/${fieldId}?date=${selectedDate}`);
    } catch (err) {
      setLoading(false);
      console.error("❌ ERROR:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  // --------------------- UI ---------------------
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

        <img src={findparty} className="w-full h-full object-cover" />
      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4">

        <h2 className="text-black font-bold text-2xl">{fieldData?.field_name}</h2>
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

        {/* BUTTONS */}
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
          <div
            onClick={() => navigate(`/create-party/${fieldId}?date=${selectedDate}`)}
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

// --------------------- Component Box ---------------------
function PositionBox({ title, img, value, onChange }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border flex flex-col items-center">
      <img src={img} className="h-14 mb-2" />
      <p className="font-semibold">{title}</p>

      <input
        type="text"
        className="border border-green-500 rounded-full text-center w-20 py-1 mt-2"
        value={value === "" ? "" : value}
        onChange={(e) => onChange(e.target.value)}
      />

      <p className="text-gray-500 text-sm mt-1">คน</p>
    </div>
  );
}
