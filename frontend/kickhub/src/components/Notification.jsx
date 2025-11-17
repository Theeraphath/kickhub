import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import field from "../../public/แมตของคุณ.png";
import CountdownTimer from "./CountdownTimer";
import { useState, useEffect } from "react";

export default function Notifications() {
  const [parties, setParties] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // const apiUrl = import.meta.env.VITE_API_URL || "http://192.168.1.26:3000";
  const apiUrl = import.meta.env.VITE_API_URL || "http://192.168.1.42:3000";

  // ✅ ดึงข้อมูลการจองของผู้ใช้
  const fetchUserReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("กรุณาเข้าสู่ระบบก่อนดูการจอง");
        setLoading(false);
        return;
      }

      const res = await fetch(`${apiUrl}/api/user-reservations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        setReservations(result.data);
      } else {
        setError(result.message || "ไม่พบข้อมูลการจอง");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ดึงข้อมูลแมตช์ของผู้ใช้
  const fetchParties = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/posts/joiner`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setParties(result.data);
      }
    } catch (err) {
      setError("โหลดข้อมูลแมตช์ล้มเหลว: " + err.message);
    }
  };

  useEffect(() => {
    Promise.all([fetchUserReservations(), fetchParties()]);
  }, []);

  const translateStatus = (status) => {
    const map = {
      reserved: "จองแล้ว",
      completed: "ยืนยันการจองแล้ว",
      cancelled: "ยกเลิก",
    };
    return map[status] || "ไม่ทราบสถานะ";
  };

  const translatePaymentStatus = (payment) => {
    const map = {
      paid: "ชำระแล้ว",
      pending: "รอชำระ",
      cancelled: "ยกเลิกการชำระ",
    };
    return map[payment] || "ไม่ทราบสถานะการชำระ";
  };

  const filteredReservations = reservations.filter((data) =>
    data.field_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParties = parties.filter((data) =>
    data.field_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedReservations = [...filteredReservations].sort(
    (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime)
  );

  const sortedParties = [...filteredParties].sort(
    (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime)
  );

  return (
    <div className="flex flex-col items-center space-y-4 font-noto-thai bg-white min-h-screen pb-20">
      <img src={field} alt="" className="w-full h-55 object-cover" />

      {/* 🔍 Search bar */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 w-[18rem] shadow-xl">
          <CiSearch />
          <input
            type="text"
            placeholder="ค้นหาสนามบอล"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-600 w-full text-m focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 🔹 การจองของคุณ */}
      <div className="bg-white p-4 w-full rounded-t-lg border-gray-300">
        <h1 className="text-4xl font-bold text-black mb-4">การจองของคุณ</h1>

        {loading && <p className="text-center text-gray-500">กำลังโหลด...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {filteredReservations.length === 0 && !loading && (
          <p className="text-center text-gray-500">ยังไม่มีข้อมูลการจอง</p>
        )}

        <div className="space-y-4 cursor-pointer mb-4">
          {sortedReservations.map((data) => (
            <div
              key={data._id}
              className={`bg-white rounded-xl shadow-md p-4 grid grid-cols-2 cursor-pointer transition ${
                data.payment_status === "paid"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
              onClick={() => {
                if (data.payment_status !== "paid") {
                  navigate(`/promptpay/${data._id}`, { state: { data: data } });
                }
              }}
            >
              <img
                src={
                  data.field_id?.image
                    ? `${apiUrl}/uploads/photos/${data.field_id.image}`
                    : field
                }
                alt={data.field_name}
                className="w-40 h-auto object-cover rounded-md mb-2"
              />

              <div className="space-y-1 text-gray-700 text-sm">
                <h1 className="font-bold text-lg">{data.field_name}</h1>
                <div className="flex flex-col gap-2 mt-2 text-sm">
                  <span className="font-medium text-gray-700">
                    เบอร์โทร: {data.mobile_number}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">สถานะ:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                        data.status === "reserved"
                          ? "bg-yellow-500"
                          : data.status === "completed"
                          ? "bg-green-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {translateStatus(data.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">ชำระเงิน:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                        data.payment_status === "paid"
                          ? "bg-green-500"
                          : data.payment_status === "pending"
                          ? "bg-yellow-400"
                          : "bg-red-500"
                      }`}
                    >
                      {translatePaymentStatus(data.payment_status)}
                    </span>
                  </div>
                </div>

                <p>
                  {new Date(data.start_datetime).toLocaleDateString("th-TH")} (
                  {new Date(data.start_datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(data.end_datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  )
                </p>
              </div>

              <div className="col-span-2 mt-3">
                <CountdownTimer
                  start_datetime={data.start_datetime}
                  end_datetime={data.end_datetime}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 แมตช์ของคุณ */}
      <div className="bg-white p-4 w-full rounded-t-lg border-gray-300">
        <h1 className="text-4xl font-bold text-black mb-4">แมตช์ของคุณ</h1>

        {filteredParties.length === 0 && !loading && (
          <p className="text-center text-gray-500">ยังไม่มีแมตช์ที่เข้าร่วม</p>
        )}

        <div className="space-y-4 cursor-pointer mb-4">
          {sortedParties.map((data) => (
            <div
              key={data._id}
              className="bg-white rounded-xl shadow-md p-4 grid grid-cols-2"
              onClick={
                data.mode === "flexible"
                  ? () => navigate(`/historybuffet/${data._id}`)
                  : () => navigate(`/historyrole/${data._id}`)
              }
            >
              <img
                src={
                  data.image ? `${apiUrl}/uploads/photos/${data.image}` : field
                }
                alt=""
                className="w-40 h-auto object-cover rounded-md mb-2"
              />

              <div className="space-y-1 text-gray-700 text-sm">
                <h1 className="font-bold text-lg">{data.field_name}</h1>
                <p className="font-bold text-m">ปาร์ตี้: {data.party_name}</p>
                <p className="text-sm text-[#22C55E]">
                  {new Date(data.start_datetime).toLocaleDateString("th-TH")} (
                  {new Date(data.start_datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(data.end_datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  )
                </p>
              </div>

              <div className="mt-4 flex items-center space-x-1 text-sm">
                {data.avatar ? (
                  <img
                    src={data.avatar}
                    alt={data.host_name}
                    className="w-10 h-10 rounded-full object-cover mr-2"
                  />
                ) : (
                  <FaCircleUser className="text-4xl text-gray-400 mr-2" />
                )}
                <p>{data.host_name?.split(" ")[0]}</p>
                <p className="text-[#22C55E] font-bold">หัวหน้าปาร์ตี้</p>
              </div>

              <div className="col-span-2 mt-2">
                <CountdownTimer
                  start_datetime={data.start_datetime}
                  end_datetime={data.end_datetime}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
