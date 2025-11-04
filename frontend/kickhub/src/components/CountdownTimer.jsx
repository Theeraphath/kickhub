import { useEffect, useState } from "react";

export default function CountdownTimer({ date, start, end }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [status, setStatus] = useState("waiting"); // waiting | startingSoon | started | ended

  useEffect(() => {
    // ✅ ป้องกัน undefined
    if (!date || !start || !end) return;

    const startTime = new Date(`${date}T${start}:00+07:00`);
    const endTime = new Date(`${date}T${end}:00+07:00`);

    const updateCountdown = () => {
      const now = new Date();

      // ✅ กรณีเกมจบแล้ว
      if (now >= endTime) {
        setStatus("ended");
        return;
      }

      // ✅ กรณีเกมเริ่มแล้ว
      if (now >= startTime) {
        setStatus("started");
        return;
      }

      // ✅ เกมยังไม่เริ่ม — คำนวณเวลา
      const diff = startTime - now;
      const totalMinutes = Math.floor(diff / 1000 / 60);
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;

      setTimeLeft({ days, hours, minutes });

      // ✅ ใกล้เริ่ม (ภายใน 5 นาที)
      if (days === 0 && hours === 0 && minutes <= 5) {
        setStatus("startingSoon");
      } else {
        setStatus("waiting");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 15);
    return () => clearInterval(interval);
  }, [date, start, end]);

  if (!date || !start || !end) {
    return <p className="text-sm text-gray-400">⏳ กำลังโหลดข้อมูล...</p>;
  }

  // 🎨 UI แยกตามสถานะ
  const renderMessage = () => {
    switch (status) {
      case "ended":
        return (
          <p className="text-sm text-red-600 font-medium">⚽ เกมได้จบลงแล้ว</p>
        );
      case "started":
        return (
          <p className="text-sm text-orange-600 font-medium">
            🔥 เกมได้เริ่มต้นขึ้นแล้ว!
          </p>
        );
      case "startingSoon":
        return (
          <p className="text-sm text-yellow-600 font-medium">
            ⏰ เกมกำลังจะเริ่มในอีกไม่กี่นาทีนี้!
          </p>
        );
      default:
        return (
          <span className="flex items-center space-x-2">
            <p className="text-sm text-gray-700">เริ่มในอีก</p>
            <p className="text-sm text-green-600 font-semibold">
              {timeLeft.days} วัน {timeLeft.hours} ชั่วโมง {timeLeft.minutes}{" "}
              นาที
            </p>
          </span>
        );
    }
  };

  return renderMessage();
}
