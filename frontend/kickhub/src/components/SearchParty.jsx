import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchParty() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4 text-green-600">หน้าค้นหาปาร์ตี้</h1>
      <p>📅 วันที่จอง: {state?.date || "-"}</p>
      <p>🎯 โหมด: {state?.mode === "buffet" ? "บุฟเฟ่ต์" : "ล็อคตำแหน่ง"}</p>

      <button
        onClick={() => navigate("/team")}
        className="mt-5 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        🔙 กลับไปหน้า “สร้างปาร์ตี้”
      </button>
    </div>
  );
}
