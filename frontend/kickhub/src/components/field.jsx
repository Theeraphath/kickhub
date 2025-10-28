import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import "./field.css";
import KH from "../../public/KH.png";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const Field = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="container">
      <div calssName="absolute">
        {/* ปุ่มย้อนกลับ */}
        <div className="absolute bg-white pl-2 pr-2 top-1.5 left-2 rounded">
          <button className="back-left">
            <FaChevronLeft />
          </button>
        </div>
        <div className="w-full h-full object-cover">
          <img src={KH} alt="" />
        </div>

        {/* ช่องค้นหา */}
        <div className="relative w-64">
          <div></div>
          <input
            type="text"
            placeholder="ค้นหาลานฟุตบอล"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full  border border-gray-300 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring- ml-20 bottom-53 absolute bg-white h-7"
          />
        </div>
      </div>

      <div className="info">
        <div>
          <h1 className="Hone">เลือกวันที่เเละเวลา</h1>
        </div>

        <div className="dater-timer flex flex-row gap-">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="เลือกวันที่"
                slotProps={{
                  textField: {
                    sx: {
                      width: 80,
                      backgroundColor: "#22C55E",
                      borderRadius: 2,
                    },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <TimePicker
                label="เวลา"
                slotProps={{
                  textField: {
                    sx: {
                      width: 100,
                      backgroundColor: "#22C55E",
                      borderRadius: 2,
                    },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>
      <div>
        <input type="date" />
      </div>
    </div>
  );
};

export default Field;
