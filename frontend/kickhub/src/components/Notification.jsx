import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import field from "../../public/field.jpg";
import CountdownTimer from "./CountdownTimer";
import { useState, useEffect } from "react";
export default function Notifications() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const Navigate = useNavigate();
  const fetchParties = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ ดึง token จาก localStorage
      const res = await fetch("http://192.168.1.26:3000/api/posts/joiner", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ แนบ token แบบ Bearer
        },
      });

      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setParties(result.data); // หรือจัดการข้อมูลตามที่คุณต้องการ
      } else {
        setError("ไม่พบข้อมูลหรือ response ผิดรูปแบบ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);
  useEffect(() => {
    console.log("🎯 Parties updated:", parties);
  }, [parties]);

  const filteredData = parties.filter((data) =>
    data.field_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center space-y-4 font-noto-thai bg-white h-screen">
      <img src={field} alt="" className="w-full h-55 object-cover" />
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
      <div className="absolute top-50 bg-white p-4 w-full rounded-t-lg border-gray-300 min-h-full pb-16">
        <h1 className="text-4xl font-bold text-black">แมตซ์ของคุณ</h1>
        <div className="space-y-4 cursor-pointer mb-4">
          {filteredData.map((data) => {
            return (
              <div
                key={data._id}
                className="bg-white rounded-xl shadow-md p-4 grid grid-cols-2"
                onClick={
                  data.mode === "flexible"
                    ? () =>
                        Navigate(`/historybuffet/${data._id}`, {
                          state: data,
                        })
                    : () =>
                        Navigate(`/historyrole/${data._id}`, {
                          state: data,
                        })
                }
              >
                <img
                  src={field}
                  alt=""
                  className="w-40 h-auto object-cover rounded-md mb-2"
                />
                <div className="space-y-1 text-gray-700 text-sm">
                  <h1 className="font-bold text-lg">{data.field_name}</h1>
                  <h1 className="font-bold text-m">ปาตี้:{data.party_name}</h1>
                  <span className="flex text-sm space-x-2 overflow-hidden">
                    <p className="truncate max-w-40">{data.address}</p>
                    <p className="whitespace-nowrap">
                      โหมด:{" "}
                      {data.mode === "flexible" ? "บุฟเฟ่ต์" : "ล็อคตำแหน่ง"}
                    </p>
                  </span>
                  <span className="flex text-sm space-x-2 overflow-hidden text-[#22C55E]">
                    <p>{new Date(data.start_datetime).toLocaleDateString()}</p>
                    <p>
                      {new Date(data.start_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(data.end_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </span>
                </div>
                <div className="mt-4">
                  <span className="flex items-center space-x-1 text-sm">
                    {data.avatar ? (
                      <img
                        src={data.avatar}
                        alt={data.name}
                        className="w-10 h-10 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <FaCircleUser className="text-4xl text-gray-400 mr-2" />
                    )}
                    <p>{data.host_name.split(" ")[0]}</p>
                    <p className="text-[#22C55E] font-bold">หัวหน้าปาร์ตี้</p>
                  </span>
                </div>
                <div className="mt-4 flex items-center space-x-1 text-sm">
                  <CountdownTimer
                    start_datetime={data.start_datetime}
                    end_datetime={data.end_datetime}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
