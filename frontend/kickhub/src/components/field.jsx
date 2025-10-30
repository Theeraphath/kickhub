import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import "./field.css";
import KH from "../../public/KH.png";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Cardfiled from "./cardfield.jsx";

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
            className="w-full  border border-gray-300 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring- ml-20 bottom-47 absolute bg-white h-7"
          />
        </div>
      </div>

      <div className="info">
        <div>
          <h1 className="Hone">เลือกวันที่เเละเวลา</h1>
        </div>
           <div>
             <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label="วันที่เเละเวลา"
         slotProps={{
        textField: {
          sx: {
            backgroundColor: "#22C55E", // สีพื้นหลัง
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#22C55E", // สีขอบ
              },
              "&:hover fieldset": {
                borderColor: "#fff", // สีขอบเมื่อ hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#004D40", // สีขอบเมื่อ focus
              },
            },
            "& .MuiInputLabel-root": {
              color: "#fff", // สี label
            },
            "& .MuiInputBase-input": {
              color: "#fff", // สีข้อความ input
            },
          },
        },
      }}
        />
      </DemoContainer>
    </LocalizationProvider>
           </div>
       
        <div>
          < Cardfiled />
           < Cardfiled />
            < Cardfiled />
        </div>
      </div>
      <div>
      
      </div>
    </div>
  );
};

export default Field;
