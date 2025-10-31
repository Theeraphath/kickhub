import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import findparty from "../../public/party2.png";
import fieldImg from "../../public/field.jpg";
import { useNavigate } from "react-router-dom";

export default function FindCreateParty() {
  const navigate = useNavigate(); 

  const [fields, setFields] = useState([
    {
      id: 1,
      name: "สนามไรมง",
      location: "คลองหลวง, ปทุมธานี",
      price: 700,
      openingHours: "11:00 - 23:00",
      features: ["ที่จอดรถ", "ห้องน้ำ", "ห้องอาบน้ำ"],
      image: fieldImg,
    },
    {
      id: 2,
      name: "สนามฟุตซอลบางแค",
      location: "บางแค, กรุงเทพฯ",
      price: 600,
      openingHours: "10:00 - 22:00",
      features: ["ที่จอดรถ", "ห้องน้ำ"],
      image: fieldImg,
    },
  ]);

  return (
    <div className="flex flex-col items-center">
      {/* HEADER */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <div className="absolute top-5 left-36 z-10">
          <form className="flex items-center bg-white rounded-full shadow-sm px-3 py-2 w-[200px]">
            <button type="button" className="text-gray-400">
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
              className="flex-1 px-2 py-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              placeholder="ค้นหาสนามบอล"
              required
              type="text"
            />
          </form>
        </div>
        <img src={findparty} alt="findparty" className="w-full h-full object-cover" />
      </div>

      {/* BODY */}
      <div className="relative bottom-0 bg-[#F2F2F7] rounded-t-lg h-[28.5rem] w-[24.5rem] p-5 overflow-y-auto absolute bottom-1">
        <h2 className="text-black font-bold mb-4 text-lg">
          ค้นหาปาร์ตี้ / สร้างปาร์ตี้
        </h2>

        <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.id} className="bg-white shadow-md rounded-2xl overflow-hidden relative">
              <div className="flex p-4">
                <img src={field.image} alt={field.name} className="w-[120px] h-[120px] object-cover rounded-xl" />
                <div className="ml-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{field.name}</h3>
                    <div className="flex items-center mt-1 text-gray-500 text-sm">
                      <FaMapMarkerAlt className="text-green-500 mr-1" />
                      <span>{field.location}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-green-700 bg-green-100 font-semibold px-2 py-1 rounded-lg text-xs">
                      {field.price} บาท/ชม.
                    </p>
                    <div className="flex items-center bg-white shadow-sm rounded-lg px-2 py-1 text-xs font-semibold text-gray-700">
                      <FaClock className="mr-1 text-gray-600" />
                      <span>{field.openingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ปุ่มดูรายละเอียด */}
              <div className="flex justify-end px-4 py-3">
                <button
                  onClick={() => navigate("/findandcreate")}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full text-sm transition"
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
