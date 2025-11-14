// src/components/FindandCreate.jsx
import React, { useEffect, useState, useRef } from "react";
import { FaClock, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import findparty from "../../public/party2.png";
import teamImg from "../../public/team.png";
import BottomNav from "./Navbar";

const API = "http://172.20.10.4:3000";

export default function FindandCreate() {
  const navigate = useNavigate();
  const { fieldId } = useParams();

  const [mode, setMode] = useState("บุฟเฟ่ต์");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [teams, setTeams] = useState([]);
  const [fieldData, setFieldData] = useState(null);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState("search");

  const dropdownRef = useRef(null);

  // ----------------------- โหลดข้อมูลสนาม -----------------------
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
        console.error("load field error:", err);
      }
    };
    loadField();
  }, [fieldId]);

  // ----------------------- โหลดข้อมูลปาร์ตี้ -----------------------
  useEffect(() => {
    if (!fieldId || !selectedDate) return;

    const loadPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/api/posts-field/${fieldId}?date=${selectedDate}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setTeams(res.data?.data || []);
      } catch (err) {
        console.error("load posts error:", err);
        setTeams([]);
      }
    };
    loadPosts();
  }, [fieldId, selectedDate]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowModeDropdown(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ----------------------- Utility -----------------------
  const convertMode = (th) => (th === "บุฟเฟ่ต์" ? "flexible" : "fixed");
  const dateOnly = (iso) => (iso ? iso.split("T")[0] : "");

  const filteredTeams = teams.filter((team) => {
    const matchMode = team.mode === convertMode(mode);
    const matchDate = dateOnly(team.start_datetime) === selectedDate;
    return matchMode && matchDate;
  });

  const getFieldImage = (img) =>
    img ? `${API}/${img.replace(/\\/g, "/")}` : findparty;

  return (
    <div className="flex flex-col items-center pb-20 font-noto-thai">
      {/* HEADER image */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <button
          onClick={() => navigate("/FindCreateParty")}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
        >
          <FaArrowLeft className="text-green-600 text-lg" />
        </button>

        <img
  src={findparty}
  alt="header"
  className="w-full h-full object-cover"
/>

      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        {/* Field Name + Google Map */}
        <h2 className="text-black font-bold text-2xl">
          {fieldData?.field_name || "สนามฟุตบอล"}
        </h2>

        {/* ROW: address left + dropdown right */}
        <div className="flex items-center justify-between text-gray-600 text-sm mb-2 mt-1">
          {/* ADDRESS (left) */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() =>
              fieldData?.google_map &&
              window.open(fieldData.google_map, "_blank")
            }
          >
            <FaMapMarkerAlt className="text-green-500 mr-1" />
            <span className="underline">
              {fieldData?.address || "ที่อยู่สนาม"}
            </span>
          </div>

          {/* MODE DROPDOWN (right) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowModeDropdown((s) => !s)}
              className="bg-green-100 text-green-700 border border-green-300 rounded-full px-3 py-1 text-sm font-semibold"
            >
              โหมด: {mode} ▾
            </button>

            {showModeDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow z-30">
                <button
                  className={`block w-full text-left px-3 py-2 ${
                    mode === "บุฟเฟ่ต์" ? "bg-green-50" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setMode("บุฟเฟ่ต์");
                    setShowModeDropdown(false);
                  }}
                >
                  บุฟเฟ่ต์
                </button>

                <button
                  className={`block w-full text-left px-3 py-2 ${
                    mode === "ล็อคตำแหน่ง" ? "bg-green-50" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setMode("ล็อคตำแหน่ง");
                    setShowModeDropdown(false);
                  }}
                >
                  ล็อคตำแหน่ง
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DATE BAR */}
        <div className="w-full bg-green-500 text-white rounded-xl px-4 py-3 flex items-center gap-3 my-4">
          <span className="text-white text-lg">📅</span>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white font-semibold text-sm w-full outline-none"
          />
        </div>

        {/* Search + Create buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveButton("search")}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold border 
              ${
                activeButton === "search"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-green-600 border-green-500"
              }`}
          >
            ค้นหาปาร์ตี้
          </button>

          <button
            onClick={() => navigate(`/create-party/${fieldId}`)}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold border 
              bg-white text-green-600 border-green-500`}
          >
            สร้างปาร์ตี้
          </button>
        </div>

        {/* Party list */}
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div
              key={team._id}
              className="bg-white shadow-md rounded-2xl p-4 mb-4"
            >
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={
                    team.image
                      ? `${API}/${team.image.replace(/\\/g, "/")}`
                      : teamImg
                  }
                  className="w-[80px] h-[80px] rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{team.party_name}</h3>
                  <p className="text-sm text-gray-500">{fieldData?.address}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    โหมด:{" "}
                    {team.mode === "flexible" ? "บุฟเฟ่ต์" : "ล็อคตำแหน่ง"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-xs">
                  <FaClock className="mr-1 text-gray-600" />
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

                <p className="text-sm font-semibold text-gray-600">
                  {dateOnly(team.start_datetime)}
                </p>
              </div>
            </div>
          ))
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
