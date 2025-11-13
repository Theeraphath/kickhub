import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import findparty from "../../public/party2.png";
import teamImg from "../../public/team.png";
import BottomNav from "./Navbar";

export default function FindandCreate() {
  const navigate = useNavigate();
  const { fieldId } = useParams(); // ดึง fieldId จาก URL

  const [mode, setMode] = useState("บุฟเฟ่ต์");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [teams, setTeams] = useState([
    {
      id: 1,
      teamName: "ทีมแมงเล้",
      fieldName: "สนามไรมง",
      location: "คลองหลวง, ปทุมธานี",
      time: "17:00 - 18:00",
      date: "06/11/2568",
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
      date: "06/11/2568",
      currentPlayers: 5,
      maxPlayers: 12,
      status: "ว่างอยู่ 7 คน",
      image: teamImg,
      mode: "ล็อคตำแหน่ง",
    },
  ]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    const buddhistYear = (parseInt(year) + 543).toString();
    return `${day}/${month}/${buddhistYear}`;
  };

  const filteredTeams = teams.filter(
    (team) => team.mode === mode && team.date === formatDate(selectedDate)
  );

  return (
    <div className="flex flex-col items-center pb-20">
      <div className="relative w-[24.5rem] h-[10rem]">
        <button
          onClick={() => navigate("/team")}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <FaArrowLeft className="text-green-600 text-lg" />
        </button>
        <img src={findparty} alt="findparty" className="w-full h-full object-cover" />
      </div>

      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] h-[100rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        <h2 className="text-black font-bold text-xl mb-2">สนามฟุตบอล</h2>
        <p className="text-gray-600 mb-3 text-sm">สนามไรมง</p>

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
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate(`/findandcreate/${fieldId}`)}
            className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-green-600"
          >
            ค้นหาปาร์ตี้
          </button>

          <button
            onClick={() => navigate(`/create-party/${fieldId}`)}
            className="border border-green-500 text-green-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-100"
          >
            สร้างปาร์ตี้
          </button>
        </div>

        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div key={team.id} className="bg-white shadow-md rounded-2xl p-4 mb-4 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <img src={team.image} alt={team.teamName} className="w-[80px] h-[80px] object-cover rounded-xl" />
                <div>
                  <h3 className="font-bold text-gray-800">{team.teamName}</h3>
                  <p className="text-sm text-gray-500">{team.location} • {team.fieldName}</p>
                  <p className="text-xs text-red-500 font-semibold mt-1">{team.status}</p>
                  <p className="text-xs text-green-600 font-semibold">โหมด: {team.mode}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-xs text-gray-700">
                  <FaClock className="mr-1 text-gray-600" />
                  <span>{team.time}</span>
                </div>
                <p className="text-sm font-semibold text-gray-600">{team.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center font-semibold mt-10">ไม่พบปาร์ตี้ในวันที่ดังกล่าว</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
