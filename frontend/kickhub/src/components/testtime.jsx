import { useState } from "react";
import { IoMdTime } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

export default function TimeSelector({ onSubmit }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("15:00");
  const [endTime, setEndTime] = useState("16:00");

  const handleSubmit = () => {
    if (!date || !startTime || !endTime) return;

    const start = new Date(`${date}T${startTime}:00.000`);
    const end = new Date(`${date}T${endTime}:00.000`);

    const result = {
      start_datetime: start.toISOString(),
      end_datetime: end.toISOString(),
    };

    onSubmit?.(result);
  };

  return (
    <div>
      <h1>เลือกวันที่และเวลา</h1>

      <div className="flex flex-row items-center gap-2">
        <input
          type="date"
          value={date}
          placeholder="เลือกวันที่"
          className="bg-green-400 text-white p-2 rounded-xl"
          onChange={(e) => setDate(e.target.value)}
        />

        <span className="flex flex-row gap-1 bg-green-400 text-white p-2 rounded-xl items-center justify-center">
          <IoMdTime className="mb-1 text-xl" />
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            {[...Array(24)].map((_, hour) => {
              const timeString = hour.toString().padStart(2, "0") + ":00";
              return (
                <option key={hour} value={timeString}>
                  {timeString}
                </option>
              );
            })}
          </select>
          <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
            {[...Array(24)].map((_, hour) => {
              const timeString = hour.toString().padStart(2, "0") + ":00";
              return (
                <option key={hour} value={timeString}>
                  {timeString}
                </option>
              );
            })}
          </select>
        </span>

        <button
          className="bg-green-400 text-white p-3 rounded-xl"
          onClick={handleSubmit}
        >
          <FaSearch className="text-xl" />
        </button>
      </div>
    </div>
  );
}
