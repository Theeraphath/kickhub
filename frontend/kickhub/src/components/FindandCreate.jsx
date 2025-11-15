// src/components/FindandCreate.jsx

import React, { useEffect, useState, useRef } from "react";
import { FaClock, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import findparty from "../../public/party2.png";
import teamImg from "../../public/team.png";
import BottomNav from "./Navbar";

import { API } from "../config";


export default function FindandCreate() {
  const navigate = useNavigate();
  const { fieldId } = useParams();

  // =============== STATE ===============
  const [mode, setMode] = useState("บุฟเฟ่ต์");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [teams, setTeams] = useState([]);
  const [fieldData, setFieldData] = useState(null);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState("search");

  const dropdownRef = useRef(null);

  // =============== โหลดข้อมูลสนาม ===============
  useEffect(() => {
    if (!fieldId) return;

    const loadField = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/fields/${fieldId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setFieldData(res.data?.data || null);
      } catch (err) {
        console.error("❌ โหลดข้อมูลสนามล้มเหลว:", err);
        setFieldData(null);
      }
    };

    loadField();
  }, [fieldId]);

  // =============== โหลดปาร์ตี้ ===============
  useEffect(() => {
    if (!fieldId || !selectedDate) return;

    const loadPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API}/api/posts-field/${fieldId}?date=${selectedDate}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        setTeams(res.data?.data || []);
      } catch (err) {
        console.error("❌ โหลดปาร์ตี้ล้มเหลว:", err);
        setTeams([]);
      }
    };

    loadPosts();
  }, [fieldId, selectedDate]);

  // =============== ปิด Dropdown เมื่อคลิกข้างนอก ===============
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowModeDropdown(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // =============== Utility ===============

  const convertMode = (th) => (th === "บุฟเฟ่ต์" ? "flexible" : "fixed");

  const dateOnly = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    d.setHours(d.getHours() + 7);
    return d.toISOString().split("T")[0];
  };

  const formatDateTime = (isoStart, isoEnd) => {
    const start = new Date(isoStart);
    const end = new Date(isoEnd);
    start.setHours(start.getHours() + 7);
    end.setHours(end.getHours() + 7);

    const date = start.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const startTime = start.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const endTime = end.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit"
    });

    return `${date} ${startTime} - ${endTime}`;
  };

  // =============== Filter ปาร์ตี้ ===============
  const filteredTeams = teams.filter((team) => {
    const matchMode = team.mode === convertMode(mode);
    const matchDate = dateOnly(team.start_datetime) === selectedDate;
    return matchMode && matchDate;
  });

  // =============== UI ===============
  return (
    <div className="flex flex-col items-center pb-20 font-noto-thai">

      {/* HEADER */}
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

       {/* บรรทัดชื่อสนาม + โหมด */}
<div className="flex items-center justify-between w-full mb-1">
  
  {/* ชื่อสนาม */}
  <h2 className="text-black font-bold text-2xl">
    {fieldData?.field_name || "สนามฟุตบอล"}
  </h2>

  {/* Dropdown โหมด (ขวาสุด) */}
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={() => setShowModeDropdown((e) => !e)}
      className="bg-green-100 text-green-700 border border-green-300 rounded-full px-3 py-1 text-sm font-semibold"
    >
      โหมด: {mode} ▾
    </button>

    {showModeDropdown && (
      <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow z-30">
        <button
          onClick={() => {
            setMode("บุฟเฟ่ต์");
            setShowModeDropdown(false);
          }}
          className="block w-full px-3 py-2 text-left hover:bg-gray-100"
        >
          บุฟเฟ่ต์
        </button>

        <button
          onClick={() => {
            setMode("ล็อคตำแหน่ง");
            setShowModeDropdown(false);
          }}
          className="block w-full px-3 py-2 text-left hover:bg-gray-100"
        >
          ล็อคตำแหน่ง
        </button>
      </div>
    )}
  </div>
</div>

{/* บรรทัดที่อยู่ */}
<div
  className="flex items-center text-gray-600 text-sm mb-2 cursor-pointer"
  onClick={() =>
    fieldData?.google_map && window.open(fieldData.google_map, "_blank")
  }
>
  <FaMapMarkerAlt className="text-green-500 mr-1" />
  <span className="underline">{fieldData?.address}</span>
</div>


        {/* เลือกวันที่ */}
        <div className="w-full bg-green-500 text-white rounded-xl px-4 py-3 flex items-center gap-3 my-4">
          <span>📅</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent font-semibold text-sm w-full outline-none"
          />
        </div>

        {/* ปุ่มค้นหา/สร้าง */}
        <div className="flex gap-3 mb-6">
          <button
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold border ${
              activeButton === "search"
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-green-600 border-green-500"
            }`}
            onClick={() => setActiveButton("search")}
          >
            ค้นหาปาร์ตี้
          </button>

          <button
            onClick={() => navigate(`/create-party/${fieldId}`)}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-bold bg-white text-green-600 border border-green-500"
          >
            สร้างปาร์ตี้
          </button>
        </div>

        {/* รายการปาร์ตี้ */}
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => {
            const joined = team.participants?.length || 0;
            const need = team.total_required_players || 0;
            const missing = need - joined;

            const img = team.image
              ? `${API}/${team.image.replace(/\\/g, "/")}`
              : teamImg;

            return (
              <div
                key={team._id}
                className="bg-white shadow-md rounded-2xl p-4 mb-4 cursor-pointer"
                onClick={() => navigate(`/party/${team._id}`)}
              >
                <div className="flex gap-4">

                  <img src={img} className="w-[110px] h-[110px] rounded-xl object-cover" />

                  <div className="flex-1">

                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-xl">
                        {team.party_name}
                      </h3>

                      <span
                        className={`px-2 py-[2px] text-[10px] font-semibold rounded-lg ${
                          team.mode === "fixed"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {team.mode === "fixed" ? "ล็อคตำแหน่ง" : "บุฟเฟ่ต์"}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mt-1">
                      {fieldData?.address}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-lg w-fit">
                      <FaClock />
                      <span>
                        {new Date(team.start_datetime).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {new Date(team.end_datetime).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {missing > 0 && (
                      <p className="text-red-500 font-bold mt-1">
                        ขาดผู้เล่น {missing} คน
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-green-600 font-semibold mt-3 text-sm">
                  {formatDateTime(
                    team.start_datetime,
                    team.end_datetime
                  )}
                </p>

                <div className="flex justify-between items-center mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold">{team.host_name}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="font-bold">
                      {joined}/{need}
                    </span>
                    <span>คน</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center font-semibold mt-5">
            ไม่พบปาร์ตี้ในโหมดนี้
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
