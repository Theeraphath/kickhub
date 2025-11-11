import promptpaylogo from "../../public/prompt-pay-logo.svg";
import generatePayload from "promptpay-qr";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import QRCode from "qrcode";
import { Modal, Box, Typography, Button } from "@mui/material";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegTimesCircle } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

export default function Promptpay() {
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state;

  useEffect(() => {
    if (!item?.data?.mobile_number || !item?.data?.payment_amount) return;

    const payload = generatePayload(item.data.mobile_number, {
      amount: item.data.payment_amount,
    });

    QRCode.toDataURL(payload, (err, url) => {
      if (err) return console.error("QR error:", err);
      setQrImage(url);
    });
  }, [item]);

  const confirmPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.26:3000/api/update-reservation/${item?.data._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ payment_status: "paid" }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log(result);
        setOpenSuccess(true);
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md max-w-md mx-auto mt-10 font-noto-thai flex flex-col items-center">
      <div className="relative flex items-center justify-between w-full p-4">
        <FaArrowLeft
          className="text-[1rem] font-bold cursor-pointer "
          onClick={() => navigate("/")}
        />
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
          QR PromptPay
        </h1>
      </div>

      <div className="bg-green-300 p-4 mt-4 w-full flex flex-col items-center">
        <p>บันทึก QR Code นี้และนำไปสแกนผ่านแอปธนาคาร</p>
      </div>

      <div className="bg-gray-200 p-4 w-full grid grid-cols-2 justify-between">
        <p>เลขที่อ้างอิง</p>
        <p className="place-self-end">{item?.data._id}</p>
        <p>จำนวนเงินที่ต้องชำระ</p>
        <p className="place-self-end">{item?.data.payment_amount}</p>
      </div>

      <div className="flex flex-col items-center w-68">
        <img src={promptpaylogo} alt="PromptPay" className="mt-4 mb-4" />

        {qrImage ? (
          <img src={qrImage} alt="PromptPay QR" className="w-full mb-4" />
        ) : (
          <p>กำลังสร้าง QR...</p>
        )}
      </div>

      <div className="flex flex-col items-center">
        <p>หมายเลขพร้อมเพย์</p>
        <p className="font-bold">{item?.data.mobile_number}</p>
        <p>{item?.data.payment_amount} บาท</p>
        <p>{item?.data.field_name}</p>
      </div>

      <div className="flex flex-col items-center w-40">
        <button
          className="bg-green-200 text-black w-full p-3 rounded-lg mt-4 mb-4 hover:bg-green-300 border border-green-400 cursor-pointer"
          onClick={() => {
            setOpen(true);
          }}
        >
          ยืนยันการชำระเงิน
        </button>

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
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                mb: 2,
              }}
            >
              <MdOutlinePayment size={32} color="#16A34A" />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontFamily: '"Noto Sans Thai", sans-serif',
              }}
            >
              ยืนยันการชำระเงิน
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#4b5563",
                fontFamily: '"Noto Sans Thai", sans-serif',
              }}
            >
              คุณต้องการยืนยันการชำระเงินนี้หรือไม่?
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
                startIcon={<FaRegTimesCircle />}
                sx={{
                  fontFamily: '"Noto Sans Thai", sans-serif',
                  color: "#16A34A",
                  borderColor: "#16A34A",
                  "&:hover": { borderColor: "#15803d", color: "#15803d" },
                }}
              >
                ยกเลิก
              </Button>

              <Button
                fullWidth
                onClick={() => {
                  confirmPayment();
                  setOpen(false);
                }}
                variant="contained"
                startIcon={<MdOutlinePayment />}
                sx={{
                  fontFamily: '"Noto Sans Thai", sans-serif',
                  backgroundColor: "#16A34A",
                  "&:hover": { backgroundColor: "#15803d" },
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
                backgroundColor: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                mb: 2,
              }}
            >
              <FiCheckCircle size={38} color="#16A34A" />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontFamily: '"Noto Sans Thai", sans-serif',
              }}
            >
              การชำระเงินสำเร็จ
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#4b5563",
                fontFamily: '"Noto Sans Thai", sans-serif',
              }}
            >
              ขอบคุณที่ใช้บริการ
            </Typography>
            <Typography
              sx={{
                mt: 1,
                color: "#4b5563",
                fontFamily: '"Noto Sans Thai", sans-serif',
              }}
            >
              ระบบได้บันทึกการชำระเงินเรียบร้อยแล้ว
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
    </div>
  );
}
