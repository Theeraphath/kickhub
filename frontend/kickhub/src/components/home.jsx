import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFire } from "react-icons/fa";
import fieldx from "../../public/thefield.png";
import { FaCircleUser } from "react-icons/fa6";
import teamImg from "../../public/team.png";
import BottomNav from "./Navbar";
import Human from "../../public/human.png";

export default function FindandCreate() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("flexible");

  useEffect(() => {
    const id = getIdbyToken();
    if (id) {
      getUser(id);
    } else {
      setError("ไม่พบ ID ผู้ใช้ใน token");
    }
  }, []);

  const getIdbyToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload._id || payload.id;
    } catch (err) {
      console.error("Token decode error:", err);
      return null;
    }
  };

  const getUser = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const res = await fetch(`http://192.168.1.26:3000/api/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`เซิร์ฟเวอร์ตอบกลับด้วยสถานะ ${res.status}`);
      }

      const result = await res.json();

      if (result.status === "success" && result.data) {
        console.log(result.data);
        setUser(result.data);
      } else {
        setError("ไม่พบข้อมูลหรือ response ผิดรูปแบบ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getparty = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://192.168.1.26:3000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setTeams(result.data);
      } else {
        setError("ไม่พบข้อมูลหรือ response ผิดรูปแบบ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message);
    }
  };

  useEffect(() => {
    getparty();
  }, []);

  const checkStatus = (team) => {
    if (team.mode === "flexible") {
      return team.participants.length >= team.total_required_players
        ? "เต็ม"
        : "ไม่เต็ม";
    } else {
      const totalRequired =
        team.required_positions?.reduce(
          (sum, pos) => sum + Number(pos.amount),
          0
        ) || 0;

      return team.participants.length >= totalRequired ? "เต็ม" : "ไม่เต็ม";
    }
  };

  useEffect(() => {
    console.log(teams);
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
      <div className=" bg-[#22C55E] relative w-full h-40">
        <p className="text-white text-2xl pl-5 pt-10">
          {" "}
          ยินดีต้อนรับคุณ {user?.name}
        </p>
        <p className="text-white text-sm pl-5">วันนี้ไปเล่นที่ไหนดีนะ ?</p>

        <img
          src={Human}
          alt="findparty"
          className="w- h-30 object-cover absolute top-1 right-2"
        />
      </div>

      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-full p-5 bottom-10 overflow-y-auto max-h-screen pb-60">
        {/* ชื่อสนาม */}

        {/* โหมด */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 justify-end">
            <select
              className="bg-green-100 text-green-700 font-semibold rounded-lg px-3 py-1 text-sm "
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="flexible">บุฟเฟ่ต์</option>
              <option value="fixed">ล็อคตำแหน่ง</option>
            </select>
          </div>
        </div>

        {/* ปุ่มค้นหา / สร้าง */}
        <div className="flex justify-between mb-4"></div>

        {/* รายการทีม */}
        {filteredTeams && filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div
              key={team._id}
              className="bg-white shadow-md rounded-2xl p-4 mb-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    team.image
                      ? `http://192.168.1.26:3000/uploads/photos/${team.image}`
                      : teamImg
                  }
                  alt={team.party_name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div onClick={() => Navigate()}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">
                      {team.party_name}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500">
                    {team.address} • {team.field_name}
                  </p>
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    {checkStatus(team)}
                  </p>
                  {/* ✅ แสดงโหมดของทีม */}
                  <p className="text-xs text-green-600 font-semibold">
                    โหมด: {team.mode == "flexible" ? "บุฟเฟ่ต์" : "ล็อคตำแหน่ง"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-xs text-gray-700">
                  <FaClock className="mr-1 text-gray-600" />
                  <span>
                    <p>
                      {new Date(team.start_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(team.end_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  {new Date(team.start_datetime).toLocaleDateString()}
                </p>
              </div>

              {/* ตัวอย่างชื่อผู้เล่น */}
              <div className="flex justify-between items-center border-t pt-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {team?.host_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700 font-semibold">
                    {team.host_name}
                  </span>
                  <span className="text-green-600 text-sm font-semibold">
                    หัวหน้าปาร์ตี้
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {team.mode === "flexible"
                    ? `${team.participants.length}/${team.total_required_players}`
                    : `${
                        team.participants.length
                      }/${team.required_positions?.reduce(
                        (sum, pos) => sum + Number(pos.amount),
                        0
                      )}`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 items-center justify-center flex">
            ไม่พบปาร์ตี้ตามโหมดที่คุณเลือก
          </p>
        )}

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
