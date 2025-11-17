import React, { useEffect, useState } from "react";
import OwnerField from "../../public/สนามของเรา.png";

export default function ApproveReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://192.168.1.34:3000";
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 🕒 ฟังก์ชันแปลง UTC → เวลาไทย
  const toThaiDateTime = (utcString) => {
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Bangkok",
    }).format(new Date(utcString));
  };

  // 📌 ดึงข้อมูลการจอง
  const fetchReservations = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiUrl}/api/reservations/field/owner`, {
        method: "GET",
        headers,
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "ไม่สามารถดึงข้อมูลการจอง");
      }

      // ✔ เรียงลำดับวันที่ตาม start_datetime
      const sorted = data.data.sort(
        (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime)
      );

      setReservations(sorted);
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  // ✔ อนุมัติการจอง
  const approveReservation = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/update-reservation/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: "completed" }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "ไม่สามารถอนุมัติการจอง");
      }

      // อัปเดตสถานะแบบ realtime
      setReservations((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "completed" } : item
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 📌 Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        ⏳ กำลังโหลดข้อมูล...
      </div>
    );

  // 📌 Error UI
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold text-lg">❌ {error}</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pb-10 font-noto-thai">
      {/* Header Image */}
      <div className="relative w-[24.5rem] h-[10rem] shadow-lg">
        <img
          src={OwnerField}
          alt="OwnerField"
          className="w-full h-full object-cover rounded-b-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative bg-white rounded-t-3xl w-[24.5rem] p-6 -mt-5 shadow-lg">
        <h1 className="text-xl font-bold text-gray-800 mb-5 text-center">
          รายการจองทั้งหมด
        </h1>

        {reservations.length === 0 ? (
          <p className="text-gray-600 text-center">ไม่มีข้อมูลการจอง</p>
        ) : (
          <ul className="space-y-5">
            {reservations.map((r) => (
              <li
                key={r._id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-lg transition duration-200"
              >
                <div className="space-y-2 text-gray-800 text-sm">
                  <p>
                    <strong>สนาม:</strong> {r.field_name}
                  </p>
                  <p>
                    <strong>ผู้จอง:</strong> {r.user_id?.name || "ไม่ระบุ"}
                  </p>
                  <p>
                    <strong>เบอร์ผู้จอง:</strong>{" "}
                    {r.user_id?.mobile_number || "ไม่ระบุ"}
                  </p>

                  <p>
                    <strong>เริ่ม:</strong> {toThaiDateTime(r.start_datetime)}
                  </p>
                  <p>
                    <strong>สิ้นสุด:</strong> {toThaiDateTime(r.end_datetime)}
                  </p>

                  <p>
                    <strong>ยอดชำระ:</strong> {r.payment_amount} บาท
                  </p>
                  <p>
                    <strong>สถานะชำระเงิน:</strong> {r.payment_status}
                  </p>

                  <p>
                    <strong>สถานะชำระเงิน:</strong>{" "}
                    <span
                      className={`font-bold ${
                        r.payment_status === "paid"
                          ? "text-green-600"
                          : r.payment_status === "pending"
                          ? "text-yellow-600"
                          : r.payment_status === "cancelled"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {r.payment_status === "paid"
                        ? "ชำระแล้ว"
                        : r.payment_status === "pending"
                        ? "รอการชำระ"
                        : r.payment_status === "cancelled"
                        ? "ยกเลิก"
                        : "ไม่ทราบสถานะ"}
                    </span>
                  </p>

                  <p>
                    <strong>สถานะการจอง:</strong>{" "}
                    <span
                      className={`font-bold ${
                        r.status === "completed"
                          ? "text-green-600"
                          : r.status === "reserved"
                          ? "text-yellow-600"
                          : r.status === "cancelled"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {r.status === "completed"
                        ? "อนุมัติแล้ว"
                        : r.status === "reserved"
                        ? "จองแล้ว"
                        : r.status === "cancelled"
                        ? "ยกเลิก"
                        : "ไม่ทราบสถานะ"}
                    </span>
                  </p>
                </div>

                {r.status !== "completed" && (
                  <button
                    onClick={() => approveReservation(r._id)}
                    className="w-full mt-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow"
                  >
                    ✔ อนุมัติการจอง
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
