import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import findparty from "../../public/party2.png";
import teamImg from "../../public/team.png";
import BottomNav from "./Navbar"; 

export default function FindandCreate() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("บุฟเฟ่ต์");

  const [teams, setTeams] = useState([
    {
      id: 1,
      teamName: "ทีมแมงเล้",
      fieldName: "สนามไรมง",
      location: "คลองหลวง, ปทุมธานี",
      time: "17:00 - 18:00",
      date: "22/10/2568",
      currentPlayers: 1,
      maxPlayers: 13,
      status: "ว่างอยู่ 12 คน",
      image: teamImg,
      mode: "บุฟเฟ่ต์",
    },
    {
      id: 2,
      teamName: "ทีมเด็กบางแค",
      fieldName: "สนามฟุตซอลบางแค",
      location: "บางแค, กรุงเทพฯ",
      time: "19:00 - 20:00",
      date: "23/10/2568",
      currentPlayers: 5,
      maxPlayers: 12,
      status: "ว่างอยู่ 7 คน",
      image: teamImg,
      mode: "ล็อคตำแหน่ง",
    },
  ]);

  // ✅ ฟิลเตอร์ทีมตามโหมดที่เลือก
  const filteredTeams = teams.filter((team) => team.mode === mode);

  return (
    <div className="flex flex-col items-center pb-20">
      {/* HEADER */}
      <div className="relative w-[24.5rem] h-[10rem]">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => navigate("/team")}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <FaArrowLeft className="text-green-600 text-lg" />
        </button>

        {/* กล่องค้นหา */}
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
        {/* ชื่อสนาม */}
        <h2 className="text-black font-bold text-xl mb-2">สนามฟุตบอล</h2>
        <p className="text-gray-600 mb-3 text-sm">สนามไรมง</p>

        {/* โหมด */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">เลือกโหมด:</span>
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
            defaultValue="2025-10-22"
          />
        </div>

        {/* ปุ่มค้นหา / สร้าง */}
        <div className="flex justify-between mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-green-600">
            ค้นหาปาร์ตี้
          </button>
          <button  onClick={() => navigate("/create-party")} className="border border-green-500 text-green-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-100">
            สร้างปาร์ตี้
          </button>
        </div>

        {/* รายการทีม */}
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white shadow-md rounded-2xl p-4 mb-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={team.image}
                alt={team.teamName}
                className="w-[80px] h-[80px] object-cover rounded-xl"
              />
              <div>
                <h3 className="font-bold text-gray-800">{team.teamName}</h3>
                <p className="text-sm text-gray-500">
                  {team.location} • {team.fieldName}
                </p>
                <p className="text-xs text-red-500 font-semibold mt-1">
                  {team.status}
                </p>
                {/* ✅ แสดงโหมดของทีม */}
                <p className="text-xs text-green-600 font-semibold">
                  โหมด: {team.mode}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-xs text-gray-700">
                <FaClock className="mr-1 text-gray-600" />
                <span>{team.time}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {team.date}
              </p>
            </div>

            {/* ตัวอย่างชื่อผู้เล่น */}
            <div className="flex justify-between items-center border-t pt-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  R
                </div>
                <span className="text-sm text-gray-700 font-semibold">
                  realka
                </span>
                <span className="text-green-600 text-sm font-semibold">
                  หัวทีม
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {team.currentPlayers}/{team.maxPlayers}
              </p>
            </div>
          </div>
        ))}
      </div>

      
      <BottomNav />
    </div>
  );
}
