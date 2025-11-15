// OwnerFieldManager.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaInfoCircle } from "react-icons/fa";
import styled from "styled-components";
import OwnerField from "../../public/สนามของเรา.png";

const API_BASE = "http://localhost:3000";

/* ------------------------------ Styled Component ----------------------------- */

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
/* ---------------------------------------------------------------------------- */

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

  /* ------------------------------ Load Fields ------------------------------ */
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

  /* ------------------------------ Reset Form ------------------------------ */
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

  /* ------------------------------ Toggle Amenity ------------------------------ */
  const handleAmenityToggle = (item) => {
    setAmenitiesState((prev) => ({ ...prev, [item]: !prev[item] }));

    setFormData((prev) => {
      const updated = prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item];
      return { ...prev, amenities: updated };
    });
  };

  /* ------------------------------ Upload Image ------------------------------ */
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  /* ------------------------------ Submit Form ------------------------------ */
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

    if (formData.image instanceof File) {
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

      if (result.status === "success") {
        await fetchFields();
        resetForm();
        setShowForm(false);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกสนาม");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  /* ------------------------------ Edit Field ------------------------------ */
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
      name: field.field_name,
      address: field.address,
      mapLink: field.google_map,
      price: field.price,
      openTime: field.open,
      closeTime: field.close,
      fieldType: field.field_type,
      promptPay: field.mobile_number,
      amenities: amenitiesArray,
      description: field.description,
      image: null,
    });

    setAmenitiesState({
      ห้องน้ำ: amenitiesArray.includes("ห้องน้ำ"),
      ที่จอดรถ: amenitiesArray.includes("ที่จอดรถ"),
      ร้านค้า: amenitiesArray.includes("ร้านค้า"),
      "wifi free": amenitiesArray.includes("wifi free"),
    });

    setIsEditing(true);
    setEditingId(field._id);
    setShowForm(true);
    setDetailField(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ------------------------------ Delete Field ------------------------------ */
  const confirmDeleteNow = async () => {
    try {
      await fetch(`${API_BASE}/api/delete-fields/${confirmDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setFields((prev) => prev.filter((f) => f._id !== confirmDelete.id));
    } catch (err) {
      alert("ไม่สามารถลบสนามได้");
    }

    setConfirmDelete({ show: false, id: null });
  };

  const formatTime = (t) => (t ? t : "-");

  const getImageUrl = (imgPath) =>
    imgPath ? `${API_BASE}/${imgPath.replace(/^\/?/, "")}` : null;

  /* ------------------------------ UI ------------------------------ */

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 pb-10">
      {/* Header Image */}
      <div className="relative w-[24.5rem] h-[10rem]">
        <img src={OwnerField} className="w-full h-full object-cover" />
      </div>

      <div className="relative bg-[#F2F2F7] rounded-t-3xl w-[24.5rem] p-5 -mt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">
            {isEditing ? "แก้ไขข้อมูลสนาม" : "จัดการสนาม"}
          </h1>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-emerald-500 px-4 py-2 text-white rounded-lg"
          >
            + เพิ่มสนามใหม่
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ชื่อ */}
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

            {/* Address */}
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

            {/* Map */}
            <input
              type="text"
              placeholder="ลิงก์ Google Map"
              value={formData.mapLink}
              onChange={(e) =>
                setFormData({ ...formData, mapLink: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            {/* Price */}
            <input
              type="text"
              placeholder="ราคา/ชม."
              value={formData.price}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v))
                  setFormData({ ...formData, price: v });
              }}
              className="w-full border rounded-lg p-2"
              required
            />

            {/* เวลาเปิด / ปิด */}
            <div className="flex gap-3">
              <div className="flex items-center border rounded-lg p-2 w-1/2">
                <FaClock className="mr-2" />
                <input
                  type="time"
                  className="w-full outline-none"
                  value={formData.openTime}
                  onChange={(e) =>
                    setFormData({ ...formData, openTime: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center border rounded-lg p-2 w-1/2">
                <FaClock className="mr-2" />
                <input
                  type="time"
                  className="w-full outline-none"
                  value={formData.closeTime}
                  onChange={(e) =>
                    setFormData({ ...formData, closeTime: e.target.value })
                  }
                />
              </div>
            </div>

            {/* ประเภทสนาม */}
            <select
              className="w-full border rounded-lg p-2"
              value={formData.fieldType}
              onChange={(e) =>
                setFormData({ ...formData, fieldType: e.target.value })
              }
            >
              <option value="หญ้าเทียม">หญ้าเทียม</option>
              <option value="หญ้าแท้">หญ้าแท้</option>
            </select>

            {/* PromptPay */}
            <input
              type="text"
              placeholder="หมายเลขพร้อมเพย์"
              value={formData.promptPay}
              onChange={(e) =>
                setFormData({ ...formData, promptPay: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            {/* Facilities */}
            <div>
              <p className="font-medium mb-2">สิ่งอำนวยความสะดวก</p>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleAmenityToggle(item)}
                    className={`px-3 py-1 rounded-full border ${
                      amenitiesState[item]
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <textarea
              placeholder="รายละเอียดเพิ่มเติม"
              className="w-full border rounded-lg p-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Upload */}
            <StyledWrapper>
              <label className="custum-file-upload" htmlFor="file">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-500">คลิกเพื่ออัปโหลดรูปภาพ</span>
                )}

                <input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </StyledWrapper>

            {/* Buttons */}
            <div className="flex gap-3 mt-3">
              <button className="w-full bg-emerald-500 text-white py-2 rounded-lg">
                {isEditing ? "บันทึกการแก้ไข" : "เพิ่มสนาม"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="w-full bg-gray-200 py-2 rounded-lg"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        )}

        {/* แสดงรายการสนาม */}
        {!showForm && fields.length > 0 && (
          <div className="mt-5 space-y-4">
            {fields.map((f) => (
              <div
                key={f._id}
                className="bg-white rounded-xl shadow border"
              >
                <div className="w-full h-36">
                  {f.image ? (
                    <img
                      src={getImageUrl(f.image)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      ไม่มีรูป
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold">{f.field_name}</h3>

                  <p className="flex items-center gap-1 text-gray-600 mt-1">
                    <FaMapMarkerAlt className="text-emerald-500" />
                    {f.address}
                  </p>

                  <p className="text-emerald-600 font-semibold mt-1">
                    ฿{f.price}/ชม.
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => handleEdit(f)}
                      className="px-4 py-1 bg-gray-200 rounded-lg"
                    >
                      แก้ไข
                    </button>

                    <button
                      onClick={() =>
                        setConfirmDelete({ show: true, id: f._id })
                      }
                      className="px-4 py-1 bg-red-200 rounded-lg"
                    >
                      ลบ
                    </button>

                    <button
                      onClick={() => setDetailField(f)}
                      className="px-4 py-1 bg-emerald-500 text-white rounded-lg"
                    >
                      รายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Confirm Delete */}
        {confirmDelete.show && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-5 w-[20rem] text-center">
              <p className="mb-3">คุณต้องการลบสนามนี้หรือไม่?</p>

              <div className="flex gap-3">
                <button
                  onClick={confirmDeleteNow}
                  className="w-full bg-red-500 text-white py-2 rounded-lg"
                >
                  ลบ
                </button>

                <button
                  onClick={() => setConfirmDelete({ show: false, id: null })}
                  className="w-full bg-gray-200 py-2 rounded-lg"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Detail */}
        {detailField && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl p-5 max-w-[22rem] max-h-[90vh] overflow-auto">
              <h2 className="text-xl font-bold mb-2">
                {detailField.field_name}
              </h2>

              <p className="text-gray-600">{detailField.address}</p>

              <p className="text-emerald-600 font-semibold mt-2">
                ราคา {detailField.price}/ชม.
              </p>

              <p className="mt-1">
                <FaClock className="inline-block mr-1" />
                {formatTime(detailField.open)} - {formatTime(detailField.close)}
              </p>

              <p className="mt-2">
                <a
                  href={detailField.google_map}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  เปิดใน Google Maps
                </a>
              </p>

              <div className="mt-3">
                <p className="font-semibold">สิ่งอำนวยความสะดวก</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {detailField.facilities &&
                    Object.entries(
                      typeof detailField.facilities === "string"
                        ? JSON.parse(detailField.facilities)
                        : detailField.facilities
                    )
                      .filter(([_, v]) => v)
                      .map(([key]) => (
                        <span
                          key={key}
                          className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs"
                        >
                          {key}
                        </span>
                      ))}
                </div>
              </div>

              <button
                onClick={() => setDetailField(null)}
                className="w-full mt-4 bg-emerald-500 text-white py-2 rounded-lg"
              >
                ปิด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
