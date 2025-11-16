// ========================================
//   FindandCreate.jsx — FIXED FULL VERSION
// ========================================

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

  const dropdownRef = useRef(null);

  // ============================
  // LOAD FIELD
  // ============================
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
        console.error("Load field error:", err);
      }
    };
    loadField();
  }, [fieldId]);

  // ============================
  // LOAD POSTS
  // ============================
  useEffect(() => {
    if (!fieldId) return;

    const loadTeams = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API}/api/posts-field/${fieldId}?date=${selectedDate}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        setTeams(res.data?.data || []);
      } catch (err) {
        console.error("Load posts error:", err);
      }
    };
    loadTeams();
  }, [fieldId, selectedDate]);

  // ============================
  // CLOSE MODE DROPDOWN
  // ============================
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowModeDropdown(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ============================
  // UTIL FUNCTIONS
  // ============================

  const convertMode = (th) => (th === "บุฟเฟ่ต์" ? "flexible" : "fixed");

  const formatFieldOpenClose = (open, close) =>
    open && close ? `${open} - ${close}` : "";

  const formatTimeRange = (startIso, endIso) => {
    if (!startIso || !endIso) return "";
    const start = new Date(startIso);
    const end = new Date(endIso);

    const s = start.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    });

    const e = end.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    });

    return `${s} - ${e}`;
  };

  const formatThaiDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // ============================
  // PLAYER COUNT LOGIC
  // ============================

  const getCurrentPlayers = (team) => {
    if (!team.participants) return 1;
    return team.participants.length;
  };

  const getTotalPlayers = (team) => {
    if (team.mode === "flexible") {
      return (team.total_required_players || 0) + 1; // + host
    }

    if (team.mode === "fixed") {
      const requiredPositions = team.required_positions || [];

      const requiredTotal = requiredPositions.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );

      return requiredTotal + 1; // + host
    }

    return 11;
  };

  const getMissing = (team) => {
    const current = getCurrentPlayers(team);
    const total = getTotalPlayers(team);

    return {
      current,
      total,
      missing: Math.max(total - current, 0),
    };
  };

  // ============================
  // IMAGE PATH
  // ============================
  const getPostImage = (filename) =>
    filename ? `${API}/uploads/photos/${filename}` : teamImg;

  const getProfileImage = (filename) =>
    filename ? `${API}/uploads/photos/${filename}` : teamImg;

  const filteredTeams = teams.filter((t) => t.mode === convertMode(mode));

  // ============================
  // UI
  // ============================
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
        <h2 className="text-black font-bold text-2xl">
          {fieldData?.field_name || "สนามฟุตบอล"}
        </h2>

        {/* Address + Mode */}
        <div className="flex items-center justify-between text-gray-600 text-sm mt-1">
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

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="bg-green-100 text-green-700 border border-green-300 rounded-full px-3 py-1 text-sm font-semibold"
            >
              โหมด: {mode} ▾
            </button>

            {showModeDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setMode("บุฟเฟ่ต์");
                    setShowModeDropdown(false);
                  }}
                >
                  บุฟเฟ่ต์
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
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

        {/* DATE */}
        <div className="w-full bg-green-500 text-white rounded-xl px-4 py-3 mt-4 flex items-center gap-3">
          <span className="text-xl">📅</span>
          <input
            type="date"
            className="bg-transparent text-white font-semibold text-sm w-full outline-none"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 my-5">
          <button className="flex-1 bg-green-500 text-white font-bold py-2 rounded-xl">
            ค้นหาปาร์ตี้
          </button>

          <button
            onClick={() =>
              navigate(`/create-party/${fieldId}?date=${selectedDate}`)
            }
            className="flex-1 bg-white text-green-600 border border-green-500 font-bold py-2 rounded-xl"
          >
            สร้างปาร์ตี้
          </button>
        </div>

        {/* PARTY LIST */}
        {filteredTeams.length > 0 ? (
  filteredTeams.map((team) => {
    const { current, total, missing } = getMissing(team);

    return (
      <div
        key={team._id}
        className="bg-white shadow-lg rounded-2xl p-4 mb-4 cursor-pointer"
        onClick={() => navigate(`/post-detail/${team._id}`)}
      >
        {/* =============== TOP SECTION =============== */}
        <div className="flex items-start justify-between">
          {/* team image */}
          <img
            src={getPostImage(team.image)}
            className="w-20 h-20 rounded-xl object-cover mr-3"
          />

          {/* center text */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-800">
                {team.party_name}
              </h3>

              <span className="text-sm text-green-600 font-semibold">
                โหมด: {team.mode === "flexible" ? "บุฟเฟ่ต์" : "ล็อคตำแหน่ง"}
              </span>
            </div>

            {/* address */}
            <p className="text-gray-600 text-sm mt-1">
              {fieldData?.province || fieldData?.address || "จังหวัดไม่ทราบ"}
            </p>

            {/* open / close */}
            <p className="text-gray-700 text-sm mt-2">
              เวลาเปิดสนาม:{" "}
              <span className="font-semibold">
                {formatFieldOpenClose(fieldData?.open, fieldData?.close)}
              </span>
            </p>

            {/* missing players */}
            <p
              className={`text-sm font-bold mt-1 ${
                missing > 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              {missing > 0
                ? `ขาดผู้เล่น ${missing} คน`
                : "ครบผู้เล่นแล้ว"}
            </p>

            {/* booked time */}
            <p className="text-green-600 text-sm font-semibold mt-1">
              {formatThaiDate(team.start_datetime)} •{" "}
              {formatTimeRange(team.start_datetime, team.end_datetime)}
            </p>
          </div>
        </div>

        {/* =============== DIVIDER =============== */}
        <hr className="border-gray-200 my-3" />

        {/* =============== BOTTOM SECTION =============== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={
                team.host_image
                  ? getProfileImage(team.host_image)
                  : team.participants?.[0]?.profile_image
                  ? getProfileImage(team.participants[0].profile_image)
                  : teamImg
              }
              className="w-8 h-8 rounded-full object-cover border"
            />

            <div className="flex flex-col">
              <p className="text-gray-800 text-sm font-semibold">
                {team.host_name}
              </p>
              <p className="text-xs text-gray-500">หัวตี</p>
            </div>
          </div>

          {/* player status */}
          <div className="text-right">
            <p className="text-green-600 text-sm font-semibold">ว่าง</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
              👤 {current}/{total}
            </p>
          </div>
        </div>
      </div>
    );
  })
) : (
  <p className="text-center text-gray-500 font-semibold mt-5">
    ไม่พบปาร์ตี้ในโหมดนี้
  </p>
)}

      </div>

      <BottomNav />
    </div>
  );
}