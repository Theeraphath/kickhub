import { FaArrowLeft, FaRegUser, FaMapMarkerAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import googlemap from "../../public/Google_Maps_icon_(2020).png";
import photo from "../../public/field.jpg";

export default function Partybuffet() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("info");
  const [status, setStatus] = useState("waiting");

  const dummydata = {
    id: 2,
    party_name: "ไรมง",
    type: "บุฟเฟ่ต์",
    field_name: "สนามฟุตบอลศรีปทุม",
    address: "สนามฟุตบอลศรีปทุม",
    date: "2022-06-30",
    start: "17:00",
    end: "18:00",
    price: "90",
    host: { id: 1, name: "เอนโด มาโมรุ" },
    participants: [
      { id: 1, name: "เอนโด มาโมรุ", status: "เข้าร่วม" },
      { id: 2, name: "โกเอนจิ ชูยะ", status: "เข้าร่วม" },
      { id: 3, name: "คิโด ยูโตะ", status: "เข้าร่วม" },
      { id: 4, name: "คาเซมารุ อิจิโรตะ", status: "เข้าร่วม" },
      { id: 5, name: "โซเมโอกะ ริวโกะ", status: "เข้าร่วม" },
      { id: 6, name: "โซเมโอกะ ริวโกะ", status: "เข้าร่วม" },
      { id: 7, name: "โซเมโอกะ ริวโกะ", status: "เข้าร่วม" },
    ],
    player_num: 14,
    body: "บอลสมัครเล่นรวมตัวกันทุกเย็นวันพุธ เล่นแบบเป็นกันเอง เน้นความสนุกและการรู้จักเพื่อนใหม่",
    google_map_link: "https://maps.app.goo.gl/oKR8s7gfsfGVqKPs8",
  };

  const convertDateThai = (dateString) => {
    const date = new Date(dateString);
    const daysThai = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    const monthsThai = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    return `วัน${daysThai[date.getDay()]}, ${date.getDate()} ${
      monthsThai[date.getMonth()]
    }`;
  };

  const progress = (current, total) => (current / total) * 100;

  useEffect(() => {
    if (!dummydata.date || !dummydata.end) return;

    const endTime = new Date(`${dummydata.date}T${dummydata.end}:00+07:00`);

    const interval = setInterval(() => {
      const now = new Date();
      if (now >= endTime) {
        setStatus("ended");
        clearInterval(interval);
      }
    }, 1000); // check every second

    return () => clearInterval(interval); // cleanup
  }, [dummydata.date, dummydata.end]);

  useEffect(() => {
    console.log("Status changed:", status);
  }, [status]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden font-noto-thai mt-6 mb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-3 ">
        <FaArrowLeft
          onClick={() => navigate(-1)}
          className="text-lg text-gray-600 cursor-pointer mr-3 hover:text-green-500"
        />
        <h1 className="font-bold text-lg">
          รายละเอียดปาร์ตี้ {dummydata.party_name}
        </h1>
      </div>

      {/* Cover */}
      <div className="relative">
        <img src={photo} alt="สนาม" className="w-full h-48 object-cover" />
        {status === "ended" && (
          <div className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full text-white text-sm flex items-center shadow-md transition-opacity duration-500 opacity-100">
            <p>การแข่งขันสิ้นสุดแล้ว</p>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-green-500 px-3 py-1 rounded-full text-white text-sm flex items-center shadow-md">
          <FaRegUser className="mr-2" />
          {dummydata.participants.length}/{dummydata.player_num}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex  bg-gray-50">
        <button
          onClick={() => setTab("info")}
          className={`w-1/2 py-3 font-semibold transition-colors ${
            tab === "info"
              ? "text-green-600 border-b-2 border-green-500 bg-white"
              : "text-gray-500 hover:text-green-500"
          }`}
        >
          รายละเอียด
        </button>
        <button
          onClick={() => setTab("participants")}
          className={`w-1/2 py-3 font-semibold transition-colors ${
            tab === "participants"
              ? "text-green-600 border-b-2 border-green-500 bg-white"
              : "text-gray-500 hover:text-green-500"
          }`}
        >
          ผู้เข้าร่วม
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 h-full">
        {tab === "info" && (
          <>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{dummydata.field_name}</h2>
              <span className="text-green-600 font-bold">
                {dummydata.price}฿ / คน
              </span>
            </div>

            <p className="flex items-center text-gray-600 mb-3">
              <FaMapMarkerAlt className="mr-1 text-green-500" />{" "}
              {dummydata.address}
            </p>

            <div className="grid grid-cols-2 text-sm text-gray-700 mb-4">
              <div>
                <p className="text-gray-400">วัน/เวลา</p>
                <p>
                  {convertDateThai(dummydata.date)}{" "}
                  <span className="text-red-500">*</span> {dummydata.start} -{" "}
                  {dummydata.end}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">หัวหน้าปาร์ตี้</p>
                <p>{dummydata.host.name.split(" ")[0]}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <p className="text-gray-500 text-sm mb-1">ความคืบหน้า</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{
                  width: `${progress(
                    dummydata.participants.length,
                    dummydata.player_num
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {dummydata.participants.length}/{dummydata.player_num} คน
            </p>

            {/* Description */}
            <div className="mt-4">
              <span className="flex items-center">
                <h3 className="font-semibold text-green-600">
                  [ โหมด: {dummydata.type} ]
                </h3>
                <h3 className="ml-2">{dummydata.party_name}</h3>
              </span>
              <p className="text-gray-700 mt-1 text-sm">{dummydata.body}</p>
            </div>

            {/* Map Button */}
            <a
              href={dummydata.google_map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center mt-5 border border-green-500 text-green-600 py-2 rounded-full hover:bg-green-50 transition"
            >
              <img
                src={googlemap}
                alt="Google Maps"
                className="w-3 h-auto mr-2"
              />
              เปิดบน Google Maps
            </a>
          </>
        )}

        {tab === "participants" && (
          <div>
            <h3 className="font-bold mb-3">
              ผู้เข้าร่วมทั้งหมด ({dummydata.participants.length})
            </h3>
            <div className="min-h-full pb-20 overflow-y-auto space-y-2">
              {dummydata.participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                >
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <FaCircleUser className="text-4xl text-gray-400 mr-3" />
                  )}
                  <div className="flex flex-col flex-1">
                    <p className="font-semibold">{p.name.split(" ")[0]}</p>
                    <span
                      className={`text-xs mt-1 w-fit px-2 py-0.5 rounded-full ${
                        p.status === "เข้าร่วม"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {status === "waiting" && (
        <div className="fixed bottom-0 left-0 w-full flex justify-center p-4 bg-white shadow-md">
          {" "}
          <button className="bg-green-500 text-white font-bold text-[1.2rem] px-4 py-2 w-full rounded-full">
            {" "}
            เข้าร่วม{" "}
          </button>{" "}
        </div>
      )}
    </div>
  );
}
