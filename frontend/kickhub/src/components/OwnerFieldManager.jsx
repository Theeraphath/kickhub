// OwnerFieldManager.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";
import OwnerField from "../../public/สนามของเรา.png";

export default function OwnerFieldManager() {
  // รายการสนาม (เก็บใน localStorage)
  const [fields, setFields] = useState(() => {
    try {
      const raw = localStorage.getItem("owner_fields_demo_v1");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  // ฟอร์ม / modal states
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailField, setDetailField] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  // ฟอร์มข้อมูล
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

  const fileInputRef = useRef(null);

  const amenitiesList = ["ห้องน้ำ", "ที่จอดรถ", "ร้านค้า", "wifi free"];

  useEffect(() => {
    // เก็บ fields ลง localStorage ทุกครั้งที่เปลี่ยน
    try {
      localStorage.setItem("owner_fields_demo_v1", JSON.stringify(fields));
    } catch (e) {
      console.warn("Failed to save fields:", e);
    }
  }, [fields]);

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
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleAmenityToggle = (item) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // ใช้ URL.createObjectURL เพื่อ preview (ใน production ควร upload ไป storage)
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // validation พื้นฐาน
    if (!formData.name.trim()) {
      alert("กรุณากรอกชื่อสนาม");
      return;
    }
    if (!formData.mapLink.trim()) {
      alert("กรุณากรอกลิงก์ Google Maps");
      return;
    }
    if (!formData.openTime || !formData.closeTime) {
      alert("กรุณาเลือกเวลาเปิดและเวลาปิด");
      return;
    }

    if (isEditing && editingId !== null) {
      setFields((prev) =>
        prev.map((f) => (f.id === editingId ? { ...f, ...formData } : f))
      );
    } else {
      const newField = { id: Date.now().toString(), ...formData };
      setFields((prev) => [newField, ...prev]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (field) => {
    setFormData({ ...field });
    setIsEditing(true);
    setEditingId(field.id);
    setShowForm(true);
    // scroll to top of form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const confirmDeleteNow = () => {
    setFields((prev) => prev.filter((f) => f.id !== confirmDelete.id));
    setConfirmDelete({ show: false, id: null });
  };

  const openDetail = (field) => {
    setDetailField(field);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Styles for upload box (responsive to parent width)
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
    .custum-file-upload .icon svg {
      height: 64px;
      fill: rgba(75, 85, 99, 1);
    }
    .custum-file-upload .text span {
      font-weight: 400;
      color: rgba(75, 85, 99, 1);
    }
    .custum-file-upload input {
      display: none;
    }
  `;

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

      {/* title + add button */}
      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">จัดการสนามใหม่</h1>
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

        {/* ถ้ายังไม่มีสนาม */}
        {fields.length === 0 && !showForm && (
          <div className="border border-gray-300 rounded-xl text-center text-gray-500 p-8">
            <p className="mb-1">ยังไม่มีสนามในระบบ</p>
            <p className="text-sm">เริ่มต้นด้วยการเพิ่มสนามใหม่</p>
          </div>
        )}

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
            />

            <input
              type="text"
              placeholder="ที่ตั้ง/สถานที่"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border rounded-lg p-2"
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

            {/* ช่องราคา */}
            <input
              type="text"
              placeholder="ราคา/ชม."
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setFormData({ ...formData, price: value });
                } else {
                  alert("กรุณากรอกเฉพาะตัวเลขเท่านั้น");
                }
              }}
              className="w-full border rounded-lg p-2"
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

            {/* ช่องพร้อมเพย์ */}
            <input
              type="text"
              placeholder="หมายเลขพร้อมเพย์"
              value={formData.promptPay}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setFormData({ ...formData, promptPay: value });
                } else {
                  alert("กรุณากรอกเฉพาะตัวเลขเท่านั้น");
                }
              }}
              className="w-full border rounded-lg p-2"
            />

            <div>
              <p className="text-gray-700 font-medium mb-2">
                สิ่งอำนวยความสะดวกและสภาพแวดล้อม
              </p>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleAmenityToggle(item)}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      formData.amenities.includes(item)
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

            <div className="mt-1">
              <label className="block text-xs text-gray-600 mb-2">
                รูปสนาม
              </label>
              <StyledWrapper>
                <label className="custum-file-upload relative" htmlFor="file">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="preview"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10Z"
                            fill="#4B5563"
                          />
                        </svg>
                      </div>
                      <div className="text">
                        <span>Click to upload image</span>
                      </div>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
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

        {/* รายการสนาม (preview แบบการ์ด) */}
        {fields.length > 0 && !isEditing && !showForm && (
          <div className="mt-4 space-y-4">
            {fields.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                {/* รูปสนาม */}
                <div className="w-full h-36 bg-gray-100">
                  {f.image ? (
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      ไม่มีรูป
                    </div>
                  )}
                </div>

                {/* ข้อมูลสนาม */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {f.name}
                      </h3>
                      {f.address && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-emerald-500" />
                          {f.address}
                        </p>
                      )}
                      <p className="text-sm text-emerald-600 font-semibold mt-1">
                        ฿{f.price}/ชม.
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 flex items-center gap-1">
                      <FaClock className="text-emerald-500" />
                      <span>
                        {f.openTime} - {f.closeTime}
                      </span>
                    </div>
                  </div>

                  {/* ปุ่ม */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(f)}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
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
      </div>

      {/* Detail modal */}
      {detailField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl overflow-auto max-h-[90vh]">
            <div className="mb-3 flex justify-between items-start">
              <h2 className="text-lg font-semibold">{detailField.name}</h2>
              <button
                onClick={() => setDetailField(null)}
                className="text-gray-500"
              >
                ปิด
              </button>
            </div>

            {detailField.image && (
              <img
                src={detailField.image}
                alt={detailField.name}
                className="w-full h-36 object-cover rounded-lg mb-3"
              />
            )}

            <p className="text-sm text-slate-600 mb-2">
              <strong>ประเภทสนาม:</strong> {detailField.fieldType}
            </p>
            <p className="text-sm text-slate-600 mb-2">
              <strong>ราคา:</strong> ฿{detailField.price}/ชม.
            </p>
            <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
              <FaClock /> {detailField.openTime} - {detailField.closeTime}
            </p>
            <p className="text-sm text-slate-600 mb-2">
              <strong>พร้อมเพย์:</strong> {detailField.promptPay || "-"}
            </p>
            <p className="text-sm text-emerald-600 mb-2">
              <a
                href={detailField.mapLink}
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center gap-2"
              >
                <FaMapMarkerAlt /> เปิดใน Google Maps
              </a>
            </p>

            {Array.isArray(detailField.amenities) &&
              detailField.amenities.length > 0 && (
                <div className="mb-3">
                  <strong className="text-sm text-slate-700">
                    สิ่งอำนวยความสะดวก:
                  </strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {detailField.amenities.map((a) => (
                      <span
                        key={a}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs border border-emerald-200"
                      >
                        {a}
                      </span>
                    ))}
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

      {/* Confirm delete modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="mb-3">ยืนยันการลบสนามนี้หรือไม่?</p>
            <div className="flex gap-2">
              <button
                onClick={confirmDeleteNow}
                className="bg-rose-500 text-white px-3 py-1 rounded"
              >
                ลบ
              </button>
              <button
                onClick={() => setConfirmDelete({ show: false, id: null })}
                className="border px-3 py-1 rounded"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
