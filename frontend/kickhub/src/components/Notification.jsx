import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaCircleUser } from "react-icons/fa6";
import field from "../../public/field.jpg";
import CountdownTimer from "./CountdownTimer";
export default function Notifications() {
  const Navigate = useNavigate();
  const dummydata = [
    {
      id: 1,
      party_name: "ไรมง",
      type: "ล็อคตำแหน่ง",
      field_name: "สนามฟุตบอลศรีปทุม",
      address: "สนามฟุตบอลศรีปทุม",
      date: "2025-11-04",
      start: "18:00",
      end: "20:00",
      host: { id: 1, name: "เอนโด มาโมรุ" },
    },
    {
      id: 2,
      party_name: "ไรมง",
      type: "บุฟเฟ่ต์",
      field_name: "สนามฟุตบอลศรีปทุม",
      address: "สนามฟุตบอลศรีปทุม",
      date: "2025-10-04",
      start: "18:00",
      end: "20:00",
      host: { id: 1, name: "เอนโด มาโมรุ" },
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4 font-noto-thai bg-white h-screen">
      <img src={field} alt="" className="w-full h-55 object-cover" />
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 w-[18rem] shadow-xl">
          <CiSearch />
          <input
            type="text"
            placeholder="ค้นหาสนามบอล"
            className="text-gray-600 w-full text-m focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="absolute top-50 bg-white p-4 w-full rounded-t-lg border-gray-300">
        <h1 className="text-4xl font-bold text-black">แมตซ์ของคุณ</h1>
        <div className="space-y-4">
          {dummydata.map((data) => (
            <div
              key={data.id}
              className="bg-white rounded-xl shadow-md p-4 grid grid-cols-2"
              onClick={
                data.type === "บุฟเฟ่ต์"
                  ? () => Navigate(`/historybuff/${data.id}`, { state: data })
                  : () => Navigate(`/historyrole/${data.id}`, { state: data })
              }
            >
              <img
                src={field}
                alt=""
                className="w-40 h-auto object-cover rounded-md mb-2"
              />
              <div className="space-y-1 text-gray-700 text-sm">
                <h1 className="font-bold text-lg">{data.field_name}</h1>
                <h1 className="font-bold text-lg">ทีม{data.party_name}</h1>
                <span className="flex text-sm space-x-2 overflow-hidden">
                  <p className="truncate max-w-40">{data.address}</p>
                  <p className="whitespace-nowrap">โหมด: {data.type}</p>
                </span>
                <span className="flex text-sm space-x-2 overflow-hidden text-[#22C55E]">
                  <p>{data.date}</p>
                  <p>
                    {data.start} - {data.end}
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
                  <p>{data.host.name.split(" ")[0]}</p>
                  <p className="text-[#22C55E] font-bold">หัวหน้าปาร์ตี้</p>
                </span>
              </div>
              <div className="mt-4 flex items-center space-x-1 text-sm">
                <CountdownTimer
                  date={data.date}
                  start={data.start}
                  end={data.end}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
