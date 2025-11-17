// OwnerFieldManager.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";
import OwnerField from "../../public/สนามของเรา.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://192.168.1.42:3000";

/* ---------------------------
   Animation & UI CSS (injected)
   --------------------------- */
const animations = `
/* fade-in */
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fadeIn .24s ease-out; }

/* pop-up (scale) */
@keyframes popUp {
  0% { transform: scale(.7); opacity: 0; }
  60% { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.pop-up { animation: popUp .34s cubic-bezier(.22,1,.36,1); }

/* shake for input error */
@keyframes shakeX {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}
.shake { animation: shakeX 0.22s linear; }

/* Neumorphism popup (container-local) */
.neu-popup {
  background: linear-gradient(180deg,#F3F4F6,#ECECEC);
  box-shadow:
    -8px -8px 18px rgba(255,255,255,0.85),
    8px 8px 18px rgba(0,0,0,0.08);
  border-radius: 18px;
  padding: 20px 32px;
  width: min(84%, 360px);
  max-width: 360px;
  text-align: center;

  /* เปลี่ยนเป็น fixed เพื่ออยู่กลางจอจริง ๆ */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 999;
  overflow: hidden;
}


/* check icon */
.neu-check {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  margin: 6px auto 10px auto;
  background: linear-gradient(135deg, #8ef6c0, #34d399);
  color: #fff;
  font-weight: 700;
  font-size: 30px;
  box-shadow:
    inset -4px -4px 8px rgba(255,255,255,0.6),
    inset 4px 4px 8px rgba(0,0,0,0.12),
    0 6px 18px rgba(52,211,153,0.12);
  transform: translateY(0);
  animation: popUp .38s cubic-bezier(.22,1,.36,1);
}

/* subtle shine */
.neu-popup .shine {
  position: absolute;
  top: -40%;
  left: -120%;
  width: 60%;
  height: 220%;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.6) 55%, transparent 100%);
  transform: rotate(-20deg);
  opacity: 0.9;
  animation: shineMove 1.1s cubic-bezier(.2,.8,.2,1) forwards;
  pointer-events: none;
}
@keyframes shineMove {
  0% { left: -120%; }
  100% { left: 160%; }
}

/* subtle text */
.neu-popup p {
  margin: 0;
  color: #064e3b;
}

/* small helper for error text */
.error-text {
  color: #dc2626;
}

/* small shadow utility */
.shadow-soft {
  box-shadow: 0 6px 18px rgba(2,6,23,0.06);
}

/* ensure container relative (to position popup inside) */
.inner-container-relative { position: relative; }
`;

/* inject style once */
if (
  typeof document !== "undefined" &&
  !document.getElementById("ownerfield-animations")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "ownerfield-animations";
  styleSheet.innerText = animations;
  document.head.appendChild(styleSheet);
}

export default function OwnerFieldManager() {
  const [fields, setFields] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailField, setDetailField] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const fileInputRef = useRef(null);
  const [promptPayError, setPromptPayError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mapLink: "",
    price: "",
    openTime: "",
    closeTime: "",
    fieldType: "หญ้าเทียม",
    promptPay: "",
    amenities: [],
    description: "",
    image: null,
  });

  const amenitiesList = ["ห้องน้ำ", "ที่จอดรถ", "ร้านค้า", "wifi free"];
  const [amenitiesState, setAmenitiesState] = useState({
    ห้องน้ำ: false,
    ที่จอดรถ: false,
    ร้านค้า: false,
    "wifi free": false,
  });

  const token = localStorage.getItem("token");

  const StyledWrapper = styled.div`
    .custum-file-upload {
      width: 100%;
      height: 200px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      border: 2px dashed #e2e8f0;
      background-color: #ffffff;
      padding: 1rem;
      border-radius: 10px;
      overflow: hidden;
    }
    .custum-file-upload input {
      display: none;
    }
  `;

  // fetch owner fields
  const fetchFields = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/owner-fields`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFields(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching fields:", err);
    }
  };

  useEffect(() => {
    if (token) fetchFields();
  }, [token]);

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      mapLink: "",
      price: "",
      openTime: "",
      closeTime: "",
      fieldType: "หญ้าเทียม",
      promptPay: "",
      amenities: [],
      description: "",
      image: null,
    });
    setIsEditing(false);
    setEditingId(null);
    setAmenitiesState({
      ห้องน้ำ: false,
      ที่จอดรถ: false,
      ร้านค้า: false,
      "wifi free": false,
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
    setPromptPayError("");
  };

  const handleAmenityToggle = (item) => {
    setAmenitiesState((prev) => ({ ...prev, [item]: !prev[item] }));
    setFormData((prev) => {
      const updated = prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item];
      return { ...prev, amenities: updated };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation for promptPay before submit (UI-level)
    if (!formData.promptPay) {
      setPromptPayError("กรุณากรอกหมายเลขพร้อมเพย์");
      return;
    }
    if (!/^\d+$/.test(formData.promptPay)) {
      setPromptPayError("กรุณากรอกเฉพาะตัวเลขเท่านั้น");
      return;
    }
    if (formData.promptPay.length < 9) {
      setPromptPayError("กรุณากรอกหมายเลขพร้อมเพย์ให้ครบ (9–10 หลัก)");
      return;
    }

    const facilitiesMap = {
      ห้องน้ำ: "restroom",
      ที่จอดรถ: "parking",
      ร้านค้า: "shop",
      "wifi free": "wifi",
    };

    const facilitiesObject = {};
    Object.entries(facilitiesMap).forEach(([thai, eng]) => {
      facilitiesObject[eng] = formData.amenities.includes(thai);
    });

    const form = new FormData();
    form.append("field_name", formData.name);
    form.append("field_type", formData.fieldType);
    form.append("mobile_number", formData.promptPay);
    form.append("address", formData.address);
    form.append("price", formData.price);
    form.append("open", formData.openTime);
    form.append("close", formData.closeTime);
    form.append("description", formData.description);
    form.append("google_map", formData.mapLink);
    form.append("is_active", true);
    form.append("facilities", JSON.stringify(facilitiesObject));

    if (formData.image instanceof File) {
      form.append("image", formData.image);
    } else if (formData.image) {
      if (typeof formData.image === "string") {
        form.append("old_image", formData.image);
      } else if (typeof formData.image === "object") {
        if (formData.image.filename)
          form.append("old_image", formData.image.filename);
        else if (formData.image.path)
          form.append("old_image", formData.image.path);
      }
    }

    try {
      const url = isEditing
        ? `${API_BASE}/api/update-fields/${editingId}`
        : `${API_BASE}/api/add-fields`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const result = await res.json();
      if (result.status === "success" || result.message?.includes("สำเร็จ")) {
        // show success message based on mode (capture before reset)
        setSuccessMessage(
          isEditing ? "แก้ไขข้อมูลสนามสำเร็จ!" : "เพิ่มสนามสำเร็จ!"
        );
        await fetchFields();
        resetForm();
        setShowForm(false);

        // show popup inside container
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1800);

        return;
      } else {
        console.error("save field error:", result);
        alert("เกิดข้อผิดพลาดในการบันทึกสนาม");
      }
    } catch (err) {
      console.error("Error saving field:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกสนาม");
    }
  };

  // When user clicks edit: prefill form and keep existing image (do not set to null)
  const handleEdit = (field) => {
    let facilities = field.facilities;
    if (typeof facilities === "string") {
      try {
        facilities = JSON.parse(facilities);
      } catch {
        facilities = {};
      }
    }
    const reverseMap = {
      restroom: "ห้องน้ำ",
      parking: "ที่จอดรถ",
      shop: "ร้านค้า",
      wifi: "wifi free",
    };
    const amenitiesArray = Object.entries(facilities || {})
      .filter(([_, v]) => v)
      .map(([key]) => reverseMap[key]);

    setFormData({
      name: field.field_name || "",
      address: field.address || "",
      mapLink: field.google_map || "",
      price: field.price || 0,
      openTime: field.open || "",
      closeTime: field.close || "",
      fieldType: field.field_type || "หญ้าเทียม",
      promptPay: field.mobile_number || "",
      amenities: amenitiesArray,
      description: field.description || "",
      image: field.image || null,
    });

    const state = {
      ห้องน้ำ: false,
      ที่จอดรถ: false,
      ร้านค้า: false,
      "wifi free": false,
    };
    amenitiesArray.forEach((a) => (state[a] = true));
    setAmenitiesState(state);

    setIsEditing(true);
    setEditingId(field._id);
    setShowForm(true);
    setDetailField(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDeleteNow = async () => {
    try {
      await fetch(`${API_BASE}/api/delete-fields/${confirmDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields((prev) => prev.filter((f) => f._id !== confirmDelete.id));
    } catch (err) {
      console.error("Error deleting field:", err);
      alert("ไม่สามารถลบสนามได้");
    }
    setConfirmDelete({ show: false, id: null });
  };

  const openDetail = (field) => {
    setDetailField(field);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (t) => (t ? t : "-");

  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === "object") {
      if (img.path) return `${API_BASE}/${img.path}`;
      if (img.filename) return `${API_BASE}/uploads/photos/${img.filename}`;
    }
    if (typeof img === "string") {
      if (img.startsWith("uploads/")) return `${API_BASE}/${img}`;
      return `${API_BASE}/uploads/photos/${img}`;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 pb-10 font-noto-thai ">
      {/* header image */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <img
          src={OwnerField}
          alt="OwnerField"
          className="w-full h-full object-cover"
        />
      </div>

      {/* container where popup will appear (positioned relative) */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)] inner-container-relative">
        {/* header & add button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            {isEditing ? "แก้ไขข้อมูลสนาม" : "จัดการสนาม"}
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-lg px-4 py-2 shadow transition"
          >
            + เพิ่มสนามใหม่
          </button>
        </div>

        {/* form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 mt-3 fade-in">
            <input
              type="text"
              placeholder="ชื่อสนาม"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            />
            <input
              type="text"
              placeholder="ที่ตั้ง/สถานที่"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            />
            <input
              type="text"
              placeholder="ลิงก์ Google Map"
              value={formData.mapLink}
              onChange={(e) =>
                setFormData({ ...formData, mapLink: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="ราคา/ชม."
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value))
                  setFormData({ ...formData, price: value });
              }}
              className="w-full border rounded-lg p-2"
              required
            />
            <div className="flex gap-2">
              <div className="flex items-center border rounded-lg p-2 w-1/2">
                <FaClock className="text-gray-500 mr-2" />
                <input
                  type="time"
                  value={formData.openTime}
                  onChange={(e) =>
                    setFormData({ ...formData, openTime: e.target.value })
                  }
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center border rounded-lg p-2 w-1/2">
                <FaClock className="text-gray-500 mr-2" />
                <input
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closeTime: e.target.value })
                  }
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
            <select
              value={formData.fieldType}
              onChange={(e) =>
                setFormData({ ...formData, fieldType: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="หญ้าเทียม">หญ้าเทียม</option>
              <option value="หญ้าแท้">หญ้าแท้</option>
            </select>

            {/* PromptPay with validation + shake + error text */}
            <div>
              <label className="text-gray-700 font-medium mb-1 block ">
                หมายเลขพร้อมเพย์
              </label>

              <input
                type="text"
                placeholder="เช่น 0612345678"
                value={formData.promptPay}
                onChange={(e) => {
                  const value = e.target.value;
                  // allow only digits
                  if (!/^\d*$/.test(value)) {
                    setPromptPayError("กรุณากรอกเฉพาะตัวเลขเท่านั้น");
                    return;
                  }
                  // limit length
                  if (value.length > 10) {
                    setPromptPayError("หมายเลขพร้อมเพย์ต้องไม่เกิน 10 หลัก");
                    return;
                  }
                  setPromptPayError("");
                  setFormData({ ...formData, promptPay: value });
                }}
                className={`w-full border rounded-lg p-2 transition-all duration-150 ${
                  promptPayError
                    ? "border-red-500 shadow-sm shake"
                    : "border-black-300"
                }`}
              />

              {promptPayError && (
                <p className="text-red-500 text-sm mt-1 error-text fade-in">
                  {promptPayError}
                </p>
              )}
            </div>

            {/* amenities */}
            <div>
              <p className="text-gray-700 font-medium mb-2">
                สิ่งอำนวยความสะดวก
              </p>
              <div className="flex flex-wrap gap-2 ho">
                {amenitiesList.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleAmenityToggle(item)}
                    className={`px-3 py-1 rounded-full border text-sm  ${
                      amenitiesState[item]
                        ? "bg-emerald-500 text-white border-emerald-500 hover:bg-white hover:text-emerald-500"
                        : "border-gray-300 text-gray-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="รายละเอียดเพิ่มเติม"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-lg p-2 min-h-[100px]"
            />

            {/* upload image */}
            <div className="mt-1">
              <label className="block text-xs text-gray-600 mb-2">
                รูปสนาม
              </label>
              <StyledWrapper>
                <label className="custum-file-upload relative" htmlFor="file">
                  {formData.image ? (
                    typeof formData.image === "object" &&
                    !(formData.image instanceof File) ? (
                      <img
                        src={getImageUrl(formData.image)}
                        alt="preview"
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    ) : formData.image instanceof File ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="preview"
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src={getImageUrl(formData.image)}
                        alt="preview"
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    )
                  ) : (
                    <div className="text-gray-500 text-center">
                      Click to upload image
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </StyledWrapper>
            </div>

            <div className="flex gap-3 mt-4 pb-6">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-semibold shadow-soft"
              >
                {isEditing ? "บันทึกการแก้ไข" : "เพิ่มสนาม"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        )}

        {/* fields list */}
    {/* Empty State — ไม่มีสนาม */}
{!showForm && fields.length === 0 && (
  <div className="flex flex-col items-center justify-center mt-10 fade-in">
    <div
      className="w-24 h-24 rounded-2xl bg-gray-200 shadow-inner flex items-center justify-center mb-4"
      style={{
        boxShadow:
          "-6px -6px 12px rgba(255,255,255,0.8), 6px 6px 12px rgba(0,0,0,0.1)",
      }}
    >
      <span className="text-gray-500 text-5xl">⚽</span>
    </div>

    <p className="text-gray-700 font-semibold text-lg">ยังไม่มีสนามของคุณ</p>
    <p className="text-gray-500 text-sm mt-1 mb-4">
      เพิ่มสนามแรกของคุณเพื่อเริ่มต้นใช้งาน
    </p>

    <button
      onClick={() => {
        resetForm();
        setShowForm(true);
      }}
      className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold shadow-soft mt-2"
    >
      + เพิ่มสนามแรกของคุณ
    </button>
  </div>
)}

{/* Fields List — มีสนาม */}
{fields.length > 0 && !showForm && (
  <div className="mt-4 space-y-4">
    {fields.map((f) => (
      <div
        key={f._id}
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
      >
        <div className="w-full h-36 bg-gray-100">
          {f.image ? (
            <img
              src={getImageUrl(f.image)}
              alt={f.field_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              ไม่มีรูป
            </div>
          )}
        </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {f.field_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-emerald-500" />{" "}
                        {f.address || "-"}
                      </p>
                      <p className="text-sm text-emerald-600 font-semibold mt-1">
                        ฿{f.price}/ชม.
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 flex items-center gap-1">
                      <FaClock className="text-emerald-500" />
                      <span>
                        {formatTime(f.open)} - {formatTime(f.close)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(f)}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() =>
                          setConfirmDelete({ show: true, id: f._id })
                        }
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 text-sm font-medium rounded-lg transition"
                      >
                        ลบ
                      </button>
                    </div>
                    <button
                      onClick={() => openDetail(f)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition"
                    >
                      <FaInfoCircle className="text-sm" /> รายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* detail modal */}
        {detailField && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl overflow-auto max-h-[90vh]">
              {detailField.image ? (
                <img
                  src={getImageUrl(detailField.image)}
                  alt={detailField.field_name}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="flex items-center justify-center h-36 bg-gray-100 text-gray-400 text-sm rounded-lg mb-3">
                  ไม่มีรูป
                </div>
              )}

              <div className="mb-3 flex justify-between items-start">
                <h2 className="text-lg font-semibold">
                  {detailField.field_name}
                </h2>
              </div>

              <p className="text-sm text-slate-600 mb-2">
                <strong>ประเภท:</strong> {detailField.field_type}
              </p>
              <p className="text-sm text-slate-600 mb-2">
                <strong>ราคา:</strong> ฿{detailField.price}/ชม.
              </p>
              <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                <FaClock /> {formatTime(detailField.open)} -{" "}
                {formatTime(detailField.close)}
              </p>
              <p className="text-sm text-slate-600 mb-2">
                <strong>พร้อมเพย์:</strong> {detailField.mobile_number || "-"}
              </p>

              <p className="text-sm text-emerald-600 mb-2">
                <a
                  href={detailField.google_map}
                  target="_blank"
                  rel="noreferrer"
                  className="underline flex items-center gap-2"
                >
                  <FaMapMarkerAlt /> เปิดใน Google Maps
                </a>
              </p>

              {detailField.facilities && (
                <div className="mb-3">
                  <strong className="text-sm text-slate-700">
                    สิ่งอำนวยความสะดวก:
                  </strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(
                      typeof detailField.facilities === "string"
                        ? JSON.parse(detailField.facilities || "{}")
                        : detailField.facilities || {}
                    )
                      .filter(([_, v]) => v)
                      .map(([key]) => {
                        const translate = {
                          parking: "ที่จอดรถ",
                          restroom: "ห้องน้ำ",
                          shop: "ร้านค้า",
                          wifi: "Wi-Fi ฟรี",
                        };
                        const label = translate[key] || key;
                        return (
                          <span
                            key={key}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs border border-emerald-200"
                          >
                            {label}
                          </span>
                        );
                      })}
                  </div>
                </div>
              )}

              {detailField.description && (
                <div className="mb-3">
                  <strong className="text-sm text-slate-700">
                    รายละเอียด:
                  </strong>
                  <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">
                    {detailField.description}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => setDetailField(null)}
                  className="w-full bg-emerald-500 text-white py-2 rounded-lg"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* confirm delete */}
        {confirmDelete.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl p-5 shadow-xl w-full max-w-sm text-center">
              <p className="mb-4">คุณต้องการลบสนามนี้ใช่หรือไม่?</p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDeleteNow}
                  className="flex-1 bg-rose-500 text-white py-2 rounded-lg"
                >
                  ลบ
                </button>
                <button
                  onClick={() => setConfirmDelete({ show: false, id: null })}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------
            Neumorphism Success Popup
            (placed INSIDE the container)
           ------------------------- */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[998] flex items-center justify-center">
            <div className="neu-popup pop-up">
              <div className="shine"></div>
              <div className="neu-check">✓</div>
              <p className="font-semibold text-base">
                {successMessage ||
                  (isEditing ? "แก้ไขข้อมูลสนามสำเร็จ!" : "เพิ่มสนามสำเร็จ!")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}