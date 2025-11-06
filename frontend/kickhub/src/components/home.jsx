import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFire } from "react-icons/fa";
import fieldx from "../../public/thefield.png";

import teamImg from "../../public/team.png";
import BottomNav from "./Navbar";
import Human from "../../public/human.png";

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
    {
      id: 3,
      teamName: "Barca",
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
  ]);

 const [field, setField] = useState("");
  const [fields, setFields] = useState([
    {
      id: 1,
      name: "สนามไรมง",
      location: "คลองหลวง, ปทุมธานี",
      price: 700,
      openingHours: "11:00 - 23:00",
      features: ["ที่จอดรถ", "ห้องน้ำ", "ห้องอาบน้ำ"],
      image: fieldx,
    },
    {
      id: 2,
      name: "A",
      location: "กรรมป่าไม้, กรุงเทพฯ",
      price: 600,
      openingHours: "10:00 - 22:00",
      features: ["ที่จอดรถ", "ห้องน้ำ"],
      image: fieldx,
    },
   
  ]);

  // ✅ ฟิลเตอร์ทีมตามโหมดที่เลือก
  const filteredTeams = teams.filter((team) => team.mode === mode);

  return (
    <div className="flex flex-col items-center pb-20 font-noto-thai">
      {/* HEADER */}
      <div className="bg-[#22C55E] rounded-b-2xl relative w-[24.5rem] h-[10rem]">
               <p className="text-white text-2xl pl-5 pt-10">ทีมของคุณ:Buddy</p>
               <p className="text-white text-sm pl-5">นัดถัดไป:21 </p>

        <img
          src={Human}
          alt="findparty"
          className="w- h-30 object-cover absolute top-1 right-2"
        />
      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-2xl w-[24.5rem] h-[100.5rem] p-5 overflow-y-auto absolute bottom-10">
        {/* ชื่อสนาม */}

        {/* โหมด */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex justify-end">
            
            <select
              className="bg-green-100 text-green-700 font-semibold rounded-lg px-3 py-1 text-sm "
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="บุฟเฟ่ต์">บุฟเฟ่ต์</option>
              <option value="ล็อคตำแหน่ง">ล็อคตำแหน่ง</option>
            </select>
          </div>

          
        </div>

        {/* ปุ่มค้นหา / สร้าง */}
        <div className="flex justify-between mb-4">
         
          
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
              <div onClick={() => Navigate()}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">{team.teamName}</h3>
               
                </div>
                
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
              <p className="text-sm font-semibold text-gray-600">{team.date}</p>
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
             


             {/* สนาม */}
        
         <div className="flex items-center gap-2 pb-3">
          <h1>สนามยอดฮิต</h1> <FaFire className="mr-1" />
         </div>
         <div>
           <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className="bg-white shadow-md rounded-2xl overflow-hidden relative"
            >
              <div className="flex p-4">
                <img
                  src={field.image}
                  alt={field.name}
                  className="w-[120px] h-[120px] object-cover rounded-xl"
                />
                <div className="ml-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-800">
                        {field.name}
                      </h3>
                      <h2 className="inline-flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-sm transition">
                        <FaFire className="mr-1" /> ยอดนิยม
                      </h2>
                    </div>

                    <div className="flex items-center  text-gray-500 text-sm pt-2">
                      <FaMapMarkerAlt className="text-green-500 mr-1" />
                      <span>{field.location}</span>
                    </div>

                    <div className="flex justify-end items-center pt-2">
                      <p className="text-white bg-green-500 font-semibold  py-1 px-1 rounded-lg text-xs">
                        {field.price} บาท/ชม.
                      </p>
                      <div className="flex items-center bg-white shadow-sm rounded-lg px-2 py-1 text-xs font-semibold text-gray-700">
                        <FaClock className="mr-1 text-gray-600" />
                        <span>{field.openingHours}</span>
                      </div>
                    </div>
                    <div className="flex flex-row justify-end gap-2 pt-2 mr-3">
                      <div className="bg-blue-500 text-white font-medium px-1 py-1 rounded-md text-xs transition">
                        ห้องน้ำ
                      </div>
                      <div className="bg-blue-500 text-white font-medium px-1 py-1 rounded-md text-xs transition">
                        ที่จอดรถ
                      </div>
                      <div className="bg-blue-500 text-white font-medium px-1 py-1 rounded-md text-xs transition">
                        ห้องอาบน้ำ
                      </div>
                    </div>

                    <div className="flex justify-end flex-wrap gap-2 px-1 py-3 mr-18 ">
                      <div className="text-gray-500 text-xs">2025-10-22</div>
                      <div className="text-gray-500 text-xs">12:30</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ปุ่มดูรายละเอียด */}
              <div className="flex justify-between px-4 py-3 bg-gray-100">
                <p className="bg-red-500  text-white font-semibold px-4 py-2 rounded-md text-sm transition ">
                  {" "}
                  ว่าง
                </p>
                <button
                  onClick={() => navigate("")}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md text-sm transition"
                >
                  ดูรายละเอียด →
                </button>
              </div>
              
            </div>
          ))}
          </div>  
         </div>

        
      </div>

      

      <BottomNav />
    </div>
  );
}
