import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import team from "../../public/team.png";
import green from "../../public/green.jpg";
import { FaSearch, FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Human from "../../public/human.png";
import { CgProfile } from "react-icons/cg";
// import { FaFireAlt } from "react-icons/fa";

const home = () => {
  const navigate = useNavigate();

  const [fields, setFields] = useState([
    {
      id: 1,
      name: "สนามไรมง",
      location: "คลองหลวง, ปทุมธานี",
      price: 700,
      openingHours: "11:00 - 23:00",
      features: ["ที่จอดรถ", "ห้องน้ำ", "ห้องอาบน้ำ"],
      image: team,
      mode: "บุฟเฟ่ต์",
    },
    {
      id: 2,
      name: "A",
      location: "กรรมป่าไม้, กรุงเทพฯ",
      price: 600,
      openingHours: "10:00 - 22:00",
      features: ["ที่จอดรถ", "ห้องน้ำ"],
      image: team,
      mode: "บุฟเฟ่ต์",
    },
   
   
  ]);

  return (
    <div>
      <div className="flex flex-col items-center font-noto-thai">
        {/* HEADER */}
        <div className="relative w-[24.5rem] h-[10rem]">
          {/* form อยู่มุมขวาล่าง */}
          <div className="absolute  flex justify-end z-10 m-3">
            <h1 className="absolute left-0 top-1 text-white text-3xl font-bold whitespace-nowrap pt-8 ">
              ทีมของคุณ: buddy
            </h1>
            {/* <FaFireAlt className="text-white absolute pt-2 text-2xl  top-17" />  */}
            <h2 className="absolute left-1 top-1 text-white text-sm font-bold whitespace-nowrap pt-18 ">
              นัดถัดไป
            </h2>
          </div>
          <img
            src={Human}
            alt=""
            className="h-[130px] w-[250px] top-3  right-0 translate-x-15 absolute"
          />

          {/* รูปภาพพื้นหลัง */}
          <img
            src={green}
            alt="findparty"
            className="object-cover 
        height-[390px] w-[400px]"
          />
        </div>

        {/* BODY */}
        <div className="relative bottom-0 bg-[#F2F2F7] rounded-t-lg h-[28.5rem] w-[24.5rem] p-5 overflow-y-auto absolute bottom-1">
          <h2 className="text-black font-bold mb-4 text-lg">ตี้ขาประจำ</h2>

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
                      </div>

                      <div className="flex items-center  text-gray-500 text-sm pt-2">
                        <FaMapMarkerAlt className="text-green-500 mr-1" />
                        <span>{field.location}</span>
                      </div>

                      <div className="flex  items-center pt-2 gap-1">
                        <div className="flex items-center bg-white shadow-sm rounded-lg px-1 py-1 text-xs font-semibold text-gray-700">
                          <FaClock className="mr-1 text-gray-600" />
                          <span>{field.openingHours}</span>
                        </div>
                        <div className="flex items-center bg-white shadow-sm rounded-lg px-2 py-1 text-xs font-semibold text-gray-700">
                          <p className=" text-gray-700">โหมด:{field.mode}</p>
                        </div>
                      </div>
                      <div>
                        <p className="pt-2 text-xs text-red-700 flex ml-2">
                          ขาดผู้เล่น 12
                        </p>
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
                  <p className="bg-blue-500  text-white font-semibold px-6 py-6 rounded-full text-sm transition ">
                    {" "}
                  </p>
                  <div className="flex items-center gap-2">
                    <CgProfile className="h-10 w-8 text-gray-600" />
                    <p className="text-gray-600 text-sm">1/13</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default home;
