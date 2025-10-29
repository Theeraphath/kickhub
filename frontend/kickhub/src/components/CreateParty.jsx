import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import findparty from "../../public/party2.png";
import buffetImg from "../../public/บุฟเฟ่ต์-removebg-preview.png";
import lockImg from "../../public/ล็อคตำแหน่ง-removebg-preview.png";
import styled from "styled-components";

export default function CreateParty() {
  const navigate = useNavigate();

  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [mode, setMode] = useState("buffet"); // buffet | lock

  const handleSearch = () => {
    navigate("/team/search", { state: { date, mode } }); // ✅ ใช้ path /team/search
  };

  const handleCreate = () => {
    alert(`สร้างปาร์ตี้วันที่ ${formatDisplayDate(date)} | โหมด: ${mode}`);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="header w-[24.5rem] h-[10rem] relative">
        {/* แถบบาร์ค้นหาสนามบอล */}
        <StyledWrapper className="absolute left-38 top-5">
          <form className="form">
            <button type="button">
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
              className="input"
              placeholder="ค้นหาสนามบอล"
              required
              type="text"
            />
            <button className="reset" type="reset">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </form>
        </StyledWrapper>
        {/* รูป */}
        <img
          src={findparty}
          alt="findparty"
          className="w-full h-full object-cover "
        />
      </div>

      {/* BODY */}
      <div className="container absolute bottom-15 rounded-t-xl bg-[#F2F2F7] h-[28.5rem] w-[24.5rem] md:bottom-130 p-5">
        {/* วันที่จอง */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            วันที่จอง
          </label>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-lg border p-2"
            />
            <div className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm">
              {formatDisplayDate(date)}
            </div>
          </div>
        </div>

        {/* ปุ่มค้นหาปาร์ตี้ / สร้างปาร์ตี้ */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={handleSearch}
            className="flex-1 py-2 rounded-lg border border-green-500 text-green-600 font-medium hover:bg-green-50"
          >
            ค้นหาปาร์ตี้
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
          >
            สร้างปาร์ตี้
          </button>
        </div>

        {/* โหมด */}
        <div className="mb-3">
          <div className="text-sm font-semibold mb-3">โหมด</div>
          <div className="grid grid-cols-2 gap-3">
            <ModeCard
              title="บุฟเฟ่ต์"
              img={buffetImg}
              selected={mode === "buffet"}
              onClick={() => setMode("buffet")}
            />
            <ModeCard
              title="ล็อคตำแหน่ง"
              img={lockImg}
              selected={mode === "lock"}
              onClick={() => setMode("lock")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({ title, img, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "bg-green-100 border-green-500 shadow-md"
          : "bg-white border-gray-200"
      }`}
    >
      <img src={img} alt={title} className="w-24 h-24 object-contain mb-2" />
      <div className="text-base font-semibold text-black">{title}</div>
    </button>
  );
}

function formatDisplayDate(isoDate) {
  if (!isoDate) return "-";
  const d = new Date(isoDate + "T00:00:00");
  const opts = { day: "2-digit", month: "2-digit", year: "numeric" };
  return d.toLocaleDateString("th-TH", opts);
}

const StyledWrapper = styled.div`
  .form button {
    border: none;
    background: none;
    color: #8b8ba7;
  }

  .form {
    --timing: 0.3s;
    --width-of-input: 230px;
    --height-of-input: 40px;
    --border-height: 2px;
    --input-bg: #fff;
    --border-color: #2f2ee9;
    --border-radius: 30px;
    --after-border-radius: 1px;
    position: relative;
    width: var(--width-of-input);
    height: var(--height-of-input);
    display: flex;
    align-items: center;
    padding-inline: 0.8em;
    border-radius: var(--border-radius);
    transition: border-radius 0.5s ease;
    background: var(--input-bg, #fff);
  }

  .input {
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    height: 100%;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: none;
  }

  .form:before {
    content: "";
    position: absolute;
    background: var(--border-color);
    transform: scaleX(0);
    transform-origin: center;
    width: 100%;
    height: var(--border-height);
    left: 0;
    bottom: 0;
    border-radius: 1px;
    transition: transform var(--timing) ease;
  }

  .form:focus-within {
    border-radius: var(--after-border-radius);
  }

  input:focus {
    outline: none;
  }

  .form:focus-within:before {
    transform: scale(1);
  }

  .reset {
    border: none;
    background: none;
    opacity: 0;
    visibility: hidden;
  }

  input:not(:placeholder-shown) ~ .reset {
    opacity: 1;
    visibility: visible;
  }

  .form svg {
    width: 17px;
    margin-top: 3px;
  }
`;
