import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import TimeSelector from "./testtime";
function Test1() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const Navigate = useNavigate();

  const fetchField = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://192.168.1.26:3000/api/fields", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        setFields(result.data); // หรือจัดการข้อมูลตามที่คุณต้องการ
        console.log(result.data);
      } else {
        setError("ไม่พบข้อมูลหรือ response ผิดรูปแบบ");
        console.error(error);
        console.log(result.data);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchField();
  }, []);

  const handleTimeSubmit = (result) => {
    console.log("เวลาที่เลือก:", result);
    setSelectedTime(result);
    // ✅ ส่งไป backend หรือใช้กรองข้อมูลต่อได้เลย
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <div>
        <h1>เลือกช่วงเวลา</h1>
        <TimeSelector onSubmit={handleTimeSubmit} />

        {selectedTime && (
          <pre className="mt-4 bg-gray-100 p-2 rounded">
            {JSON.stringify(selectedTime, null, 2)}
          </pre>
        )}
      </div>

      <div className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl font-bold text-black mb-4">
          congratulations you are logged in
        </h1>
        <h1>สนามทั้งหมด</h1>
      </div>
      <div className="flex flex-col items-center justify-center mb-4">
        {fields.map((data) => (
          <button
            key={data._id}
            className="cursor-pointer mb-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10 font-noto-thai flex flex-col items-center"
            onClick={() =>
              Navigate(`/reserve/${data._id}`, {
                state: { data, time: selectedTime },
              })
            }
          >
            <h1>{data.field_name}</h1>
            <h1>{data.is_active}</h1>
          </button>
        ))}
      </div>
      <div></div>
    </div>
  );
}

export default Test1;
