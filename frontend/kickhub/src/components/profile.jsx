import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import field from "../../public/แมตของคุณ.png";
import CountdownTimer from "./CountdownTimer";
import { IoMdExit } from "react-icons/io";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parties, setParties] = useState([]);

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

  useEffect(() => {
    const id = getIdbyToken();
    if (id) {
      getUser(id);
    } else {
      setError("ไม่พบ ID ผู้ใช้ใน token");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchParties = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://192.168.1.26:3000/api/posts/joiner", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setParties(result.data);
      } else {
        setError("ไม่พบข้อมูลหรือ response ผิดรูปแบบ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);
  useEffect(() => {
    console.log("🎯 Parties updated:", parties);
  }, [parties]);

  return (
    <div className="flex flex-col items-center font-noto-thai">
      {/* BODY */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-full p-5  flex-1 overflow-y-auto max-h-screen">
        <div className=" bg-gray-100 flex flex-col items-center py-10 px-4">
          {/* 🔹 Cover Image Section */}
          <div className="w-full max-w-3xl relative">
            <div className="h-48 bg-gray-300 rounded-2xl overflow-hidden">
              {user?.profile_photo_cover ? (
                <img
                  src={`http://localhost:3000/uploads/photos/${user.profile_photo_cover}`}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Cover Image
                </div>
              )}
            </div>

            {/* 🔹 Profile Image */}
            <div className="absolute bottom-[-130px] left-1">
              <div className="flex flex-row items-center gap-3">
                {user?.profile_photo ? (
                  <img
                    src={`http://localhost:3000/uploads/photos/${user.profile_photo}`}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <FaCircleUser className="w-28 h-28 text-gray-400" />
                )}
                <h1 className="text-2xl font-semibold">{user?.name}</h1>
              </div>
              <div className="flex flex-row items-center gap-2">
                <button
                  onClick={() =>
                    navigate("/profile/edit/" + user._id, {
                      state: { user },
                    })
                  }
                  className="bg-green-500 text-white border rounded-lg px-4 py-2 mt-2"
                >
                  <span className="flex flex-row items-center">
                    <FaUserEdit className="mr-2 " />
                    แก้ไขโปรไฟล์
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white border rounded-lg px-4 py-2 mt-2"
                >
                  <span className="flex flex-row items-center">
                    <IoMdExit />
                    ออกจากระบบ
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-20">
          <h2 className="text-xl font-semibold mb-4 mt-30 text-gray-700">
            สนามที่เคยเข้าร่วม/ปาร์ตี้
          </h2>
          {parties.map((data) => {
            return (
              <div
                key={data._id}
                className="bg-white rounded-xl shadow-md p-4 grid grid-cols-2 mt-3"
              >
                <img
                  src={
                    data.image
                      ? `http://localhost:3000/uploads/photos/${data.image}`
                      : field
                  }
                  alt=""
                  className="w-40 h-auto object-cover rounded-md mb-2"
                />
                <div className="space-y-1 text-gray-700 text-sm">
                  <h1 className="font-bold text-lg">{data.field_name}</h1>
                  <h1 className="font-bold text-m">ปาตี้:{data.party_name}</h1>
                  <span className="flex text-sm space-x-2 overflow-hidden">
                    <p className="truncate max-w-40">{data.address}</p>
                    <p className="whitespace-nowrap">
                      โหมด:{" "}
                      {data.mode === "flexible" ? "บุฟเฟ่ต์" : "ล็อคตำแหน่ง"}
                    </p>
                  </span>
                  <span className="flex text-sm space-x-2 overflow-hidden text-[#22C55E]">
                    <p>{new Date(data.start_datetime).toLocaleDateString()}</p>
                    <p>
                      {new Date(data.start_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(data.end_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </span>
                </div>
                <div className="mt-4">
                  <span className="flex items-center space-x-1 text-sm">
                    {data.avatar ? (
                      <img
                        src={data.avatar}
                        alt={data.name}
                        className="w-10 h-10 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <FaCircleUser className="text-4xl text-gray-400 mr-2" />
                    )}
                    <p>{data.host_name.split(" ")[0]}</p>
                    <p className="text-[#22C55E] font-bold">หัวหน้าปาร์ตี้</p>
                  </span>
                </div>
                <div className="mt-4 flex items-center space-x-1 text-sm">
                  <CountdownTimer
                    start_datetime={data.start_datetime}
                    end_datetime={data.end_datetime}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
