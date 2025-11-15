// OwnerFieldManager.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";
import OwnerField from "../../public/สนามของเรา.png";

const API_BASE = "http://localhost:3000";

export default function OwnerFieldManager() {
  const [fields, setFields] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailField, setDetailField] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const fileInputRef = useRef(null);

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
    if (formData.image && formData.image instanceof File) {
      form.append("image", formData.image);
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
        await fetchFields();
        resetForm();
        setShowForm(false);
      } else {
        console.error("save field error:", result);
        alert("เกิดข้อผิดพลาดในการบันทึกสนาม");
      }
    } catch (err) {
      console.error("Error saving field:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกสนาม");
    }
  };

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
      image: null,
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

  const getImageUrl = (filename) =>
  filename ? `${API_BASE}/uploads/photos/${filename}` : null;


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 pb-10">
      {/* header image */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <img
          src={OwnerField}
          alt="OwnerField"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
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
          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
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
            <input
              type="text"
              placeholder="หมายเลขพร้อมเพย์"
              value={formData.promptPay}
              onChange={(e) =>
                setFormData({ ...formData, promptPay: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            {/* amenities */}
            <div>
              <p className="text-gray-700 font-medium mb-2">
                สิ่งอำนวยความสะดวก
              </p>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleAmenityToggle(item)}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      amenitiesState[item]
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-gray-300 text-gray-600"
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
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="preview"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
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
                className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-semibold"
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
                  <strong className="text-sm text-slate-700">รายละเอียด:</strong>
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
      </div>
    </div>
  );
}