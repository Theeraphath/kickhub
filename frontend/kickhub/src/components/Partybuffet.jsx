import { FaArrowLeft, FaRegUser, FaMapMarkerAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import googlemap from "../../public/Google_Maps_icon_(2020).png";
import photo from "../../public/field.jpg";
import { IoIosRemoveCircle } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";

export default function Partybuffet() {
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState(null);
  const navigate = useNavigate();
  const [tab, setTab] = useState("info");
  const [status, setStatus] = useState("waiting");
  const { id } = useParams();

  const API = "http://172.20.10.4:3000";
  // const API = "http://192.168.1.26:3000";

  const fetchPost = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/post/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.status === "success") {
        setPostData(result.data);
      } else {
        setError("ไม่พบข้อมูล");
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost(id);
  }, [id]);

  const convertDateThai = (datetimeString) => {
    const date = new Date(datetimeString);
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
    if (!postData?.start_datetime || !postData?.end_datetime) return;

    const startTime = new Date(postData.start_datetime);
    const endTime = new Date(postData.end_datetime);
    const now = new Date();

    if (now >= endTime) {
      setStatus("ended");
      return;
    } else if (now >= startTime) {
      setStatus("started");
    } else {
      setStatus("waiting");
    }

    const interval = setInterval(() => {
      const now = new Date();
      if (now >= endTime) {
        setStatus("ended");
        clearInterval(interval);
      } else if (now >= startTime) {
        setStatus("started");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [postData?.start_datetime, postData?.end_datetime]);

  const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);
      return payload._id || payload.user_id || payload.id || null;
    } catch (err) {
      console.error("❌ Token decode error:", err);
      return null;
    }
  };

  const currentUserId = getUserIdFromToken(localStorage.getItem("token"));

  const hasJoined =
    Array.isArray(postData?.participants) &&
    postData.participants.some(
      (p) => String(p.user_id) === String(currentUserId)
    );

  const isOwner = String(postData?.user_id) === String(currentUserId);

  const joinParty = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/join-party/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status === "success") {
        console.log("✅ เข้าร่วมสำเร็จ:", result);
        fetchPost(postId); // รีโหลดข้อมูลใหม่
      } else {
        console.error("❌ เข้าร่วมไม่สำเร็จ:", result.error);
      }
    } catch (err) {
      console.error("❌ Error joining party:", err);
    }
  };

  const leaveParty = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/leave-party/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status === "success") {
        console.log("✅ ออกจากปาร์ตี้สำเร็จ:", result);
        fetchPost(postId); // รีโหลดข้อมูลใหม่
      } else {
        console.error("❌ ออกจากปาร์ตี้ไม่สำเร็จ:", result.error);
      }
    } catch (err) {
      console.error("❌ Error leaving party:", err);
    }
  };

  const deleteParty = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/delete-post/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log(result);
      if (result.status === "success") {
        console.log("✅ ลบปาร์ตี้สำเร็จ:", result);
        setOpenSuccess(true);
      } else {
        console.error("❌ ลบปาร์ตี้ไม่สำเร็จ:", result.error);
      }
    } catch (err) {
      console.error("❌ Error deleting party:", err);
    }
  };

  const isFull =
    postData?.participants?.length - 1 >= postData?.total_required_players;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!postData) return <p>ไม่พบข้อมูล</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden font-noto-thai mt-6 mb-20">
      {/* Header */}
      <div className="flex items-center px-4 py-3 ">
        <FaArrowLeft
          onClick={() => navigate(-1)}
          className="text-lg text-gray-600 cursor-pointer mr-3 hover:text-green-500"
        />
        <h1 className="font-bold text-lg">
          รายละเอียดปาร์ตี้ {postData.party_name}
        </h1>
      </div>

      {/* Cover */}
      <div className="relative">
        <img
          src={
            postData.image ? `${API}/uploads/photos/${postData.image}` : photo
          }
          alt="สนาม"
          className="w-full h-48 object-cover"
        />
        {status === "ended" && (
          <div className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full text-white text-sm flex items-center shadow-md transition-opacity duration-500 opacity-100">
            <p>การแข่งขันสิ้นสุดแล้ว</p>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-green-500 px-3 py-1 rounded-full text-white text-sm flex items-center shadow-md">
          <FaRegUser className="mr-2" />
          {postData.participants.length - 1}/{postData.total_required_players}
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
              <h2 className="text-lg font-bold">{postData.field_name}</h2>
              <span className="text-green-600 font-bold">
                {postData.price}฿ / คน
              </span>
            </div>

            <p className="flex items-center text-gray-600 mb-3">
              <FaMapMarkerAlt className="mr-1 text-green-500" />{" "}
              {postData.address}
            </p>

            <div className="grid grid-cols-2 text-sm text-gray-700 mb-4">
              <div>
                <p className="text-gray-400">วัน/เวลา</p>
                <p className="text-xs">
                  {convertDateThai(postData.start_datetime)}{" "}
                  <span className="text-red-500">*</span>{" "}
                  {new Date(postData.start_datetime).toLocaleTimeString(
                    "th-TH",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}{" "}
                  -{" "}
                  {new Date(postData.end_datetime).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">หัวหน้าปาร์ตี้</p>
                <p>{postData.host_name.split(" ")[0]}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <p className="text-gray-500 text-sm mb-1">ความคืบหน้า</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{
                  width: `${progress(
                    postData.participants.length - 1,
                    postData.total_required_players
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {postData.participants.length - 1}/
              {postData.total_required_players} คน
            </p>

            {/* Description */}
            <div className="mt-4">
              <span className="flex items-center">
                <h3 className="font-semibold text-green-600">
                  [ โหมด:{" "}
                  {postData.mode === "flexible" ? "บุฟเฟ่ต์" : "ไม่ทราบ"} ]
                </h3>
                <h3 className="ml-2">{postData.party_name}</h3>
              </span>
              <p className="text-gray-700 mt-1 text-sm">
                {postData.description}
              </p>
            </div>

            {/* Map Button */}
            <a
              href={postData.google_map}
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
              ผู้เข้าร่วมทั้งหมด ({postData.participants.length})
            </h3>
            <div className="min-h-full pb-20 overflow-y-auto space-y-2">
              {postData.participants.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                >
                  {p.profile_photo ? (
                    <img
                      src={`${API}/upload/photos/${p.profile_photo}`}
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
                        p.status === "Joined"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {p.status === "Joined" ? "เข้าร่วม" : "ไม่ทราบ"}
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
          {isOwner && (
            <button
              className="bg-red-500 text-white font-bold text-[1.2rem] px-4 py-2 w-full rounded-full"
              onClick={() => setOpen(true)}
            >
              ลบโพสต์
            </button>
          )}
          {!isOwner && (
            <button
              disabled={isFull}
              className={`${
                hasJoined ? "bg-red-500" : "bg-green-500"
              } text-white font-bold text-[1.2rem] px-4 py-2 w-full rounded-full`}
              onClick={() => {
                hasJoined ? leaveParty(postData._id) : joinParty(postData._id);
              }}
            >
              {hasJoined ? "ออกจากปาร์ตี้" : "เข้าร่วม"}
            </button>
          )}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 340,
            bgcolor: "white",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          }}
        >
          {/* ไอคอนด้านบน */}
          {/* red */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
            }}
          >
            <IoIosRemoveCircle size={100} color="red" />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontFamily: '"Noto Sans Thai", sans-serif',
            }}
          >
            ยืนยันการลบโพสต์
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#666666",
              fontFamily: '"Noto Sans Thai", sans-serif',
            }}
          >
            คุณต้องการยืนยันการลบโพสต์นี้หรือไม่?
          </Typography>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              onClick={() => setOpen(false)}
              variant="outlined"
              sx={{
                fontFamily: '"Noto Sans Thai", sans-serif',
                // need color: red,
                color: "#FF0000",
                borderColor: "#FF0000",
                "&:hover": { borderColor: "#FF0000", color: "#FF0000" },
              }}
            >
              ยกเลิก
            </Button>

            <Button
              fullWidth
              onClick={() => {
                setOpen(false);
                deleteParty(postData._id);
              }}
              variant="contained"
              sx={{
                fontFamily: '"Noto Sans Thai", sans-serif',
                backgroundColor: "#FF0000",
                "&:hover": { backgroundColor: "#FF0000" },
              }}
            >
              ยืนยัน
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openSuccess} onClose={() => navigate("/")}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 340,
            bgcolor: "white",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
            }}
          >
            {/* <FiCheckCircle size={38} color="#16A34A" /> */}
            <CiCircleRemove size={100} color="#ff0000" />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontFamily: '"Noto Sans Thai", sans-serif',
            }}
          >
            การลบโพสต์สำเร็จ
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#4b5563",
              fontFamily: '"Noto Sans Thai", sans-serif',
            }}
          >
            ระบบได้ลบโพสต์ของท่านเรียบร้อยแล้ว
          </Typography>

          <Button
            fullWidth
            onClick={() => navigate("/home")}
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: "#16A34A",
              fontFamily: '"Noto Sans Thai", sans-serif',
              "&:hover": { backgroundColor: "#15803d" },
            }}
          >
            กลับหน้าหลัก
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
