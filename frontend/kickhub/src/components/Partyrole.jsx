import { FaArrowLeft, FaRegUser, FaMapMarkerAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import googlemap from "../../public/Google_Maps_icon_(2020).png";
import photo from "../../public/field.jpg";
import goalkeeper from "../../public/ประตู.png";
import forward from "../../public/คน.png";
import midfielder from "../../public/กองกลาง-removebg-preview.png";
import defender from "../../public/กองหลัง-removebg-preview.png";

export default function PartyRole() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("info");
  const [selectedPos, setSelectedPos] = useState(null);
  const [reservedPos, setReservedPos] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState("waiting");

  const dummydata = {
    party_name: "ไรมง",
    type: "ล็อคตำแหน่ง",
    field_name: "สนามฟุตบอลศรีปทุม",
    address: "สนามฟุตบอลศรีปทุม",
    date: "2027-06-30",
    start: "17:00",
    end: "18:00",
    price: "90",
    host: { id: 1, name: "เอนโด มาโมรุ" },
    participants: [
      { id: 1, name: "เอนโด มาโมรุ", position: "forward" },
      { id: 2, name: "โกเอนจิ ชูยะ", position: "forward" },
      { id: 3, name: "คิโด ยูโตะ", position: "midfielder" },
      { id: 4, name: "คาเซมารุ อิจิโรตะ", position: "defender" },
      { id: 5, name: "โซเมโอกะ ริวโกะ", position: "goalkeeper" },
      { id: 6, name: "โดมอน อาซึกะ", position: "midfielder" },
      { id: 7, name: "อิจิโนะ", position: "defender" },
    ],
    position: {
      forward_need: 2,
      midfield_need: 6,
      defender_need: 4,
      goalkeeper_need: 2,
    },
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

  const positionLabels = {
    forward: "กองหน้า",
    midfielder: "กองกลาง",
    goalkeeper: "ผู้รักษาประตู",
    defender: "กองหลัง",
  };

  const countPositions = (participants) =>
    participants.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {});
  const counts = countPositions(dummydata.participants);
  const displayedCounts = { ...counts };
  if (reservedPos)
    displayedCounts[reservedPos] = (displayedCounts[reservedPos] || 0) + 1;

  const need = {
    forward: dummydata.position.forward_need,
    midfielder: dummydata.position.midfield_need,
    defender: dummydata.position.defender_need,
    goalkeeper: dummydata.position.goalkeeper_need,
  };

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
      <div className="flex items-center px-4 py-3 border-b">
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
      <div className="flex bg-gray-50">
        {["info", "participants"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`w-1/2 py-3 font-semibold transition-colors ${
              tab === key
                ? "text-green-600 border-b-2 border-green-500 bg-white"
                : "text-gray-500 hover:text-green-500"
            }`}
          >
            {key === "info" ? "รายละเอียด" : "ผู้เข้าร่วม"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {tab === "info" && (
          <>
            {/* Info Section */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{dummydata.field_name}</h2>
                <span className="text-green-600 font-bold">
                  {dummydata.price}฿ / คน
                </span>
              </div>

              <p className="flex items-center text-gray-600 mb-3">
                <FaMapMarkerAlt className="mr-1 text-green-500" />
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

              <div className="mt-4">
                <span className="flex items-center">
                  <h3 className="font-semibold text-green-600">
                    [ โหมด: {dummydata.type} ]
                  </h3>
                  <h3 className="ml-2">{dummydata.party_name}</h3>
                </span>
                <p className="text-gray-700 mt-1 text-sm">{dummydata.body}</p>
              </div>
            </div>

            {/* Position Booking */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "goalkeeper", label: "ผู้รักษาประตู", img: goalkeeper },
                { key: "forward", label: "กองหน้า", img: forward },
                { key: "midfielder", label: "กองกลาง", img: midfielder },
                { key: "defender", label: "กองหลัง", img: defender },
              ].map((pos) => {
                const isReserved = reservedPos === pos.key;
                const isLocked = reservedPos && !isReserved;
                return (
                  <div
                    key={pos.key}
                    className="bg-gray-50 p-3 rounded-xl shadow-sm text-center hover:shadow-md transition"
                  >
                    <img
                      src={pos.img}
                      alt={pos.label}
                      className="w-16 h-16 mx-auto mb-2"
                    />
                    <h1 className="font-bold mb-1">{pos.label}</h1>
                    <p className="text-gray-600 text-sm mb-2">
                      {displayedCounts[pos.key] || 0}/{need[pos.key]} คน
                    </p>
                    {isReserved ? (
                      <button
                        onClick={() => setReservedPos(null)}
                        disabled={status === "ended"}
                        className={`font-bold py-1.5 px-4 rounded-full w-full transition ${
                          status === "ended"
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        ยกเลิก
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (reservedPos || status === "ended") return;
                          setSelectedPos(pos.key);
                          setShowConfirm(true);
                        }}
                        disabled={isLocked || status === "ended"}
                        className={`font-bold py-1.5 px-4 rounded-full w-full transition ${
                          isLocked || status === "ended"
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        จอง
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Map Button */}
            <a
              href={dummydata.google_map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center mt-6 border border-green-500 text-green-600 py-2 rounded-full hover:bg-green-50 transition"
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
            <div className="max-h-[65vh] overflow-y-auto space-y-2">
              {dummydata.participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                >
                  <FaCircleUser className="text-4xl text-gray-400 mr-3" />
                  <div className="flex flex-col flex-1">
                    <p className="font-semibold">{p.name.split(" ")[0]}</p>
                    <span
                      className={`text-xs mt-1 w-fit px-2 py-0.5 rounded-full ${
                        p.position === "forward"
                          ? "bg-green-100 text-green-600"
                          : p.position === "goalkeeper"
                          ? "bg-red-100 text-red-600"
                          : p.position === "defender"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {positionLabels[p.position] || p.position}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedPos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm shadow-lg">
            <h3 className="font-bold mb-3 text-lg text-center text-green-600">
              ยืนยันการจองตำแหน่ง
            </h3>
            <p className="text-sm text-center mb-4">
              ต้องการจองตำแหน่ง{" "}
              <span className="font-semibold text-green-700">
                {positionLabels[selectedPos]}
              </span>{" "}
              หรือไม่?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedPos(null);
                }}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  setReservedPos(selectedPos);
                  setShowConfirm(false);
                  setSelectedPos(null);
                }}
                className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
