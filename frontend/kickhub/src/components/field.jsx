import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import KH from "../../public/KH.png";
import field from "../../public/thefield.png";
import { FaSearch, FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FindCreateParty() {
  const navigate = useNavigate();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [search, setSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [startSearch, setStartSearch] = useState("");
  const [endSearch, setEndSearch] = useState("");
  const [filteredFields, setFilteredFields] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  // ✅ ฟังก์ชันแปลง ISO → วันที่ไทย
  const formatThaiDateTime = (startISO, endISO) => {
    const start = new Date(startISO);
    const end = new Date(endISO);

    const thaiDate = start.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const startTime = start.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const endTime = end.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${thaiDate} ${startTime} - ${endTime}`;
  };

  // ✅ เมื่อกดบันทึก
  const handleSubmit = async (e) => {
    e.preventDefault();

    const startISO = new Date(start).toISOString();
    const endISO = new Date(end).toISOString();

    console.log("🗄️ เก็บในฐานข้อมูลแบบ ISO:", startISO, endISO);

    await fetch("http://localhost:3000/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_datetime: startISO,
        end_datetime: endISO,
      }),
    });
  };

  const [fields, setFields] = useState([
    {
      id: 1,
      name: "สนามไรมง",
      location: "คลองหลวง, ปทุมธานี",
      price: 700,
      openingHours: "11:00 - 23:00",
      features: ["ที่จอดรถ", "ห้องน้ำ", "ห้องอาบน้ำ"],
      image: field,
      start_datetime: "2025-11-20T10:00:00+07:00",
      end_datetime: "2025-11-20T22:00:00+07:00",
    },
    {
      id: 2,
      name: "A",
      location: "คลองหลวง, ปทุมธานี",
      price: 700,
      openingHours: "11:00 - 23:00",
      features: ["ที่จอดรถ", "ห้องน้ำ", "ห้องอาบน้ำ"],
      image: field,
      start_datetime: "2025-11-21T10:00:00+07:00",
      end_datetime: "2025-11-21T22:00:00+07:00",
    },
    {
      id: 3,
      name: "B",
      location: "คลองหลวง, ปทุมธานี",
      price: 700,
      openingHours: "11:00 - 23:00",
      features: ["ที่จอดรถ", "ห้องน้ำ", "ห้องอาบน้ำ"],
      image: field,
      start_datetime: "2025-11-22T10:00:00+07:00",
      end_datetime: "2025-11-22T22:00:00+07:00",
    },
  ]);

  // ✅ ฟังก์ชันกรองข้อมูล
  const handleSearch = () => {
    const result = fields.filter((f) => {
      const matchName = search
        ? f.name.toLowerCase().includes(search.toLowerCase())
        : true;

      const start = new Date(f.start_datetime);
      const end = new Date(f.end_datetime);

      const matchDate = dateSearch
        ? start.toISOString().slice(0, 10) === dateSearch
        : true;

      const matchStart = startSearch
        ? start.getHours() >= Number(startSearch.split(":")[0])
        : true;

      const matchEnd = endSearch
        ? end.getHours() <= Number(endSearch.split(":")[0])
        : true;

      return matchName && matchDate && matchStart && matchEnd;
    });

    setFilteredFields(result);
    setIsSearched(true);
  };

  useEffect(() => {
    const fetchFields = async () => {
      const res = await fetch("http://localhost:3000/fields");
      const data = await res.json();
      setFields(data);
    };
    fetchFields();
  }, []);

  return (
    <div className="flex flex-col items-center font-noto-thai">
      {/* HEADER */}
      <div className="relative w-[24.5rem] h-[10rem]">
        {/* form อยู่มุมขวาล่าง */}
        <div className="absolute top-1 left-23 z-10">
          <form className="flex bg-white rounded-full shadow-sm items-center  w-[220px]">
            <button type="button" className="text-gray-400 ">
              <svg
                width={17}
                height={16}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="search"
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
              className="flex-1 px-4 py-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              placeholder="ค้นหาสนามบอล"
              required
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />
          </form>
        </div>

        {/* รูปภาพพื้นหลัง */}
        <img
          src={KH}
          alt="findparty"
          className="object-cover 
        height-[390px] w-[400px]"
        />
      </div>

      {/* BODY */}

      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        <div className="p-4 font-noto-thai">
          <h2 className="text-lg font-semibold mb-3">วันที่เเละเวลา</h2>
          <div>
            <input
              type="date"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              className="border rounded px-2 py-1 border-green-500 bg-green-500 text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4 pt-4 ">
            <p>เริ่ม</p>
            <input
              type="time"
              value={startSearch}
              onChange={(e) => setStartSearch(e.target.value)}
              className="border rounded px-2 py-1  border-green-500 bg-green-500 text-white"
            />
            <p>สิ้นสุด</p>
            <input
              type="time"
              value={endSearch}
              onChange={(e) => setEndSearch(e.target.value)}
              className="border rounded px-2 py-1  border-green-500 bg-green-500 text-white"
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
            >
              ค้นหา
            </button>
          </div>

          {isSearched &&
            (filteredFields.length > 0 ? (
              <div className="space-y-2">
                {filteredFields.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 border rounded-lg shadow-sm bg-white"
                  >
                    <p className="font-medium">{f.name}</p>
                    <p>
                      วันที่: {new Date(f.start_datetime).toLocaleDateString()}
                    </p>
                    <p>
                      เวลา:{" "}
                      {new Date(f.start_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(f.end_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">ไม่พบสนามที่ตรงกับเงื่อนไข</p>
            ))}
        </div>
        {/* card */}

        <div className="flex flex-col gap-4">
          {fields
            .filter((field) =>
              field.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((field) => (
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

                      <div>
                        <div className="flex flex-row flex-wrap gap-1 overflow-hidden pt-2 ml-1">
                          {field.features.map((feature, i) => (
                            <span
                              key={i}
                              className="bg-blue-500 text-white font-medium px-1 py-1 rounded-md text-xs transition"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className=" text-gray-500 text-sm pt-2 ml-1">
                          <p>
                            {formatThaiDateTime(
                              field.start_datetime,
                              field.end_datetime
                            )}
                          </p>
                        </div>
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
  );
}
