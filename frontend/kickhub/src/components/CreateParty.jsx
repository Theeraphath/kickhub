// src/components/CreateParty.jsx
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import findparty from "../../public/party2.png";
import Buffetpic from "../../public/buffetpic.png";
import LP from "../../public/lockposition.png";
import BottomNav from "./Navbar";

const CreateParty = () => {
  const navigate = useNavigate();
  const { fieldId } = useParams(); // รับ ID สนามจาก route

  // state ของฟอร์ม
  const [mode, setMode] = useState("บุฟเฟ่ต์");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState("");
  const [hours, setHours] = useState("");
  const [price, setPrice] = useState("");
  const [partyname, setPartyname] = useState("");
  const [playername, setPlayername] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("กรุณาเข้าสู่ระบบก่อนสร้างปาร์ตี้");

      if (!partyname || !time || !hours || !price || !date)
        return alert("กรุณากรอกข้อมูลให้ครบ");

      const startIso = new Date(`${date}T${time}:00`);
      if (isNaN(startIso.getTime()))
        return alert("รูปแบบวันที่/เวลาไม่ถูกต้อง");

      const endIso = new Date(
        startIso.getTime() + Number(hours) * 60 * 60 * 1000
      );

      const formData = new FormData();
      formData.append("party_name", partyname);
      formData.append("mode", mode === "ล็อคตำแหน่ง" ? "fixed" : "buffet");
      formData.append("description", detail || "");
      formData.append("start_datetime", startIso.toISOString());
      formData.append("end_datetime", endIso.toISOString());
      formData.append("price", Number(price));
      formData.append("position", "FW");
      formData.append(
        "required_positions",
        JSON.stringify([
          { position: "GK", amount: 2 },
          { position: "FW", amount: 1 },
          { position: "DF", amount: 2 },
          { position: "MF", amount: 2 },
        ])
      );
      if (image) formData.append("image", image, image.name);

      setLoading(true);
      const url = `http://localhost:3000/api/create-post/${fieldId}`;
      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);

      if (response?.data?.status === "success" || response.status === 200) {
        alert("✅ สร้างปาร์ตี้สำเร็จ!");
        navigate("/team");
      } else {
        alert(
          "❌ เกิดข้อผิดพลาด: " + (response?.data?.message || "ไม่ทราบสาเหตุ")
        );
      }
    } catch (err) {
      setLoading(false);
      alert("เกิดข้อผิดพลาด: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="font-noto-thai">
      <div className="flex flex-col items-center pb-20">
        {/* HEADER */}
        <div className="relative w-[24.5rem] h-[10rem]">
          <button
            onClick={() => navigate("/team")}
            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-green-600 text-lg" />
          </button>

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
                required
                type="text"
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
        <div className="relative bg-[#F2F2F7] rounded-t-2xl w-[24.5rem] h-[100.5rem] p-5 overflow-y-auto absolute bottom-10">
          <h2 className="text-black font-bold text-xl mb-2">สนามฟุตบอล</h2>
          <p className="text-gray-600 mb-3 text-sm">สนามไรมง</p>

          {/* โหมด + วันที่ */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                เลือกโหมด:
              </span>
              <select
                className="bg-green-100 text-green-700 font-semibold rounded-lg px-3 py-1 text-sm"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="บุฟเฟ่ต์">บุฟเฟ่ต์</option>
                <option value="ล็อคตำแหน่ง">ล็อคตำแหน่ง</option>
              </select>
            </div>
            <input
              type="date"
              className="bg-green-100 text-green-700 rounded-lg px-3 py-1 text-sm font-semibold"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex justify-between mb-4">
            <button
              onClick={() => navigate(`/findandcreate/${fieldId}`)}
              className="border border-green-500 text-green-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-100"
            >
              ค้นหาปาร์ตี้
            </button>

            <button
              onClick={handleCreate}
              className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-green-600"
            >
              {loading ? "กำลังสร้าง..." : "สร้างปาร์ตี้"}
            </button>
          </div>

          {/* ส่วนฟอร์มเหมือนเดิมเป๊ะ */}
          {/* เวลา / ชั่วโมง / ราคา / ชื่อปาร์ตี้ / จำนวนผู้เล่น */}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-86 h-10 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 mb-2"
            placeholder="เวลา"
          />

          <div className="flex flew-row gap-3 mb-2">
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg p-1 pl-2 rounded w-38 h-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="ชั่วโมง"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg p-1 pl-2 rounded w-43 h-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="ราคา"
            />
          </div>

          <div className="flex flew-row gap-3 mb-2">
            <input
              type="text"
              value={partyname}
              onChange={(e) => setPartyname(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg p-1 pl-2 rounded w-38 h-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="ชื่อปาร์ตี้"
            />
            <input
              type="number"
              value={playername}
              onChange={(e) => setPlayername(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg p-1 pl-2 rounded w-43 h-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="จำนวนผู้เล่น"
            />
          </div>

          {/* รายละเอียด */}
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            maxLength={200}
            className="border border-gray-300 p-2 rounded-lg w-86 h-30 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none mb-2"
            placeholder="รายละเอียด (ไม่เกิน 200 ตัวอักษร)"
          />

          {/* รูปภาพ */}
          <div className="flex flex-col mb-4">
            <label
              htmlFor="fileInput"
              className="bg-white text-green-500 border-green-500 border border-gray-300 rounded-lg p-2 w-43 h-10 text-sm text-gray-400 flex items-center cursor-pointer hover:bg-gray-100"
            >
              {image ? image.name : "เลือกรูปภาพ"}
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="h-32 mt-2 rounded"
              />
            )}
          </div>

          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default CreateParty;
