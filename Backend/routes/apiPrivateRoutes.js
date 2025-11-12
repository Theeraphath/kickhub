const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const authorizeOwner = require("../middleware/authorizeOwner");
const upload = require("../middleware/uploadMiddleware");
const { MongoClient } = require("mongodb");
const {
  getUserById,
  updateUserProfile,
  changePassword,
} = require("../controllers/userController");
const {
  addField,
  getAllFields,
  updateField,
  deleteField,
  getFieldbyownerID,
  getFieldbyID,
  getFieldbyFreetime,
} = require("../controllers/fieldController");

const {
  addReservation,
  getAllReservations,
  updateReservation,
  getReservationbyID,
  getReservationbyFieldID,
  getReservationbyUserID,
} = require("../controllers/reservationController");

const {
  newPost,
  getPostbyJoinerID,
  deletePost,
  updatePost,
  getPostbyID,
  joinParty,
  leaveParty,
  getAllPosts,
  getPostUpcoming,
  getPostUpcomingbyFieldID,
} = require("../controllers/postController");

router.get("/test", authenticateToken, (req, res) => {
  res.json({
    message: "This is private data accessible only from allowed origins.",
    data: [1, 2, 3, 4, 5],
  });
});

router.get("/user/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดกับเซิร์ฟเวอร์" });
  }
});

router.put(
  "/user/update/:id",
  authenticateToken,
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "profile_photo_cover", maxCount: 1 },
  ]),
  updateUserProfile
);

router.put("/user/change-password/:id", authenticateToken, changePassword);

router.get("/user", authenticateToken, async (req, res) => {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("kickhub");
    const collection = db.collection("users");
    const users = await collection.find().toArray();
    res.status(200).json({ users });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดกับเซิร์ฟเวอร์" });
  } finally {
    await client.close();
  }
});

router.post(
  "/add-fields",
  authenticateToken,
  authorizeOwner,
  upload.single("image"),
  async (req, res) => {
    try {
      const fieldData = {
        ...req.body,
        owner_id: req.user._id,
        image: req.file.path,
      };

      const result = await addField(fieldData);

      if (result.success) {
        return res.status(201).json({
          message: "เพิ่มข้อมูลสนามสำเร็จ",
          data: result.data,
        });
      }

      return res.status(400).json({
        error: result.error?.message || "ไม่สามารถเพิ่มข้อมูลสนามได้",
      });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดที่ไม่คาดคิดในการเพิ่มข้อมูลสนาม:", err);
      return res.status(500).json({
        error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      });
    }
  }
);

router.get("/fields", authenticateToken, async (req, res) => {
  try {
    const result = await getAllFields();

    if (result.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "ไม่พบข้อมูลสนาม",
        data: result.data,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลสนามสำเร็จ",
        data: result.data,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถดึงข้อมูลสนามได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดที่ไม่คาดคิดในการดึงข้อมูลสนาม:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/fields/:id", authenticateToken, async (req, res) => {
  try {
    const fieldId = req.params.id;
    const result = await getFieldbyID(fieldId);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลสนามสำเร็จ",
        data: result.data,
      });
    }

    return res.status(404).json({
      status: "error",
      message: result.error?.message || "ไม่พบข้อมูลสนามที่ระบุ",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดที่ไม่คาดคิดในการดึงข้อมูลสนามด้วย ID:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});
// fields available in time range
router.get("/available-fields", async (req, res) => {
  try {
    const startTime = req.query.start_time;
    const endTime = req.query.end_time;
    const result = await getFieldbyFreetime(startTime, endTime);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลสนามสำเร็จ",
        data: result.data,
      });
    }

    return res.status(404).json({
      status: "error",
      message: result.error?.message || "ไม่พบข้อมูลสนามที่ระบุ",
    });
  } catch (err) {
    console.error(
      "เกิดข้อผิดพลาดที่ไม่คาดคิดในการดึงข้อมูลสนามด้วยช่วงเวลาที่กำหนด:",
      err
    );
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get(
  "/owner-fields",
  authenticateToken,
  authorizeOwner,
  async (req, res) => {
    try {
      const ownerId = req.user._id;
      const result = await getFieldbyownerID(ownerId);

      if (result.data.length === 0) {
        return res.status(200).json({
          status: "success",
          message: "ไม่พบข้อมูลสนามที่เป็นเจ้าของ",
          data: result.data,
          count: result.data?.length || 0,
          timestamp: new Date().toISOString(),
        });
      }

      if (result.success) {
        return res.status(200).json({
          status: "success",
          message: "ดึงข้อมูลสนามของเจ้าของสำเร็จ",
          data: result.data,
          count: result.data?.length || 0,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(404).json({
        status: "error",
        message: result.error?.message || "ไม่พบข้อมูลสนามของเจ้าของ",
      });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสนามของเจ้าของ:", err);
      return res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      });
    }
  }
);

router.put(
  "/update-fields/:id",
  authenticateToken,
  authorizeOwner,
  async (req, res) => {
    try {
      const fieldId = req.params.id;
      const fieldData = req.body;

      const existingField = await getFieldbyID(fieldId);
      if (!existingField.success || !existingField.data) {
        return res.status(404).json({
          status: "error",
          message: "ไม่พบข้อมูลสนามที่ระบุ",
        });
      }

      if (existingField.data.owner_id.toString() !== req.user._id) {
        return res.status(403).json({
          status: "error",
          message: "คุณไม่มีสิทธิ์แก้ไขสนามนี้",
        });
      }

      const result = await updateField(fieldId, fieldData);
      if (result.success) {
        return res.status(200).json({
          status: "success",
          message: "อัปเดตข้อมูลสนามสำเร็จ",
          data: result.data,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(400).json({
        status: "error",
        message: result.error?.message || "ไม่สามารถอัปเดตข้อมูลสนามได้",
      });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตสนาม:", err);
      return res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      });
    }
  }
);

router.delete(
  "/delete-fields",
  authenticateToken,
  authorizeOwner,
  async (req, res) => {
    try {
      const fieldId = req.params.id;

      const existingField = await getFieldbyID(fieldId);
      if (!existingField.success || !existingField.data) {
        return res.status(404).json({
          status: "error",
          message: "ไม่พบข้อมูลสนามที่ต้องการลบ",
        });
      }

      if (existingField.data.owner_id.toString() !== req.user._id) {
        return res.status(403).json({
          status: "error",
          message: "คุณไม่มีสิทธิ์ลบสนามนี้ (ไม่ใช่เจ้าของ)",
        });
      }

      const result = await deleteField(fieldId);
      if (result.success) {
        return res.status(200).json({
          status: "success",
          message: "ลบข้อมูลสนามสำเร็จ",
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(400).json({
        status: "error",
        message: result.error?.message || "ไม่สามารถลบข้อมูลสนามได้",
      });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการลบสนาม:", err);
      return res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      });
    }
  }
);

router.post("/new-reservation/:id", authenticateToken, async (req, res) => {
  try {
    const fieldId = req.params.id;
    const user_id = req.user._id;
    const reservationData = req.body;

    const result = await addReservation(fieldId, user_id, reservationData);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "เพิ่มการจองสนามสำเร็จ",
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    console.error("เกิดข้อผิดพลาดในการเพิ่มการจอง:", result.error);
    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถเพิ่มการจองได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดที่ไม่คาดคิดในการเพิ่มการจอง:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/reservations", authenticateToken, async (req, res) => {
  try {
    const result = await getAllReservations();

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลการจองทั้งหมดสำเร็จ",
        data: result.data,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถดึงข้อมูลการจองได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/reservations/:id", authenticateToken, async (req, res) => {
  try {
    const reservationId = req.params.id;
    const result = await getReservationbyID(reservationId);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลการจองสำเร็จ",
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(404).json({
      status: "error",
      message: result.error?.message || "ไม่พบข้อมูลการจองที่ระบุ",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/user-reservations", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user._id;
    const result = await getReservationbyUserID(user_id);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลการจองของผู้ใช้สำเร็จ",
        data: result.data,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถดึงข้อมูลการจองของผู้ใช้ได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจองของผู้ใช้:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/field-reservations/:id", authenticateToken, async (req, res) => {
  try {
    const fieldId = req.params.id;
    const result = await getReservationbyFieldID(fieldId);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลการจองของสนามสำเร็จ",
        data: result.data,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(404).json({
      status: "error",
      message: result.error?.message || "ไม่พบข้อมูลการจองของสนามที่ระบุ",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจองของสนาม:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.put("/update-reservation/:id", authenticateToken, async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservationData = req.body;

    const result = await updateReservation(reservationId, reservationData);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "อัปเดตข้อมูลการจองสำเร็จ",
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถอัปเดตข้อมูลการจองได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตการจอง:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.post("/create-post/:id", authenticateToken, async (req, res) => {
  try {
    const field_id = req.params.id;
    const user_id = req.user._id;
    const postdata = req.body;

    const result = await newPost(user_id, field_id, postdata);

    if (result.success) {
      return res.status(201).json({
        status: "success",
        message: "สร้างโพสต์สำเร็จ",
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถสร้างโพสต์ได้",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างโพสต์:", error);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/posts", authenticateToken, async (req, res) => {
  try {
    const result = await getPostUpcoming();

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลโพสต์สําเร็จ",
        data: result.data,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถดึงข้อมูลโพสต์ได้",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์:", error);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/posts/joiner", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user._id;
    const result = await getPostbyJoinerID(user_id);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงโพสต์ที่คุณเข้าร่วมสำเร็จ",
        data: result.data,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถดึงโพสต์ที่คุณเข้าร่วมได้",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงโพสต์ที่เข้าร่วม:", error);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/post/:id", authenticateToken, async (req, res) => {
  try {
    const post_id = req.params.id;
    const result = await getPostbyID(post_id);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลโพสต์สำเร็จ",
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(404).json({
      status: "error",
      message: result.error?.message || "ไม่พบโพสต์ที่ระบุ",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงโพสต์:", error);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.get("/posts-field/:id", authenticateToken, async (req, res) => {
  try {
    const field = req.params.id;
    const date = req.body.date;
    const result = await getPostUpcomingbyFieldID(field, date);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลโพสต์สําเร็จ",
        data: result.data,
        count: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(404).json({
      status: "error",
      message: result.error?.message || "ไม่พบโพสต์ที่ระบุ",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงโพสต์:", error);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.delete("/delete-post/:id", authenticateToken, async (req, res) => {
  try {
    const post_id = req.params.id;
    const user_id = req.user._id;

    const existingPost = await getPostbyID(post_id);
    if (!existingPost.success || !existingPost.data) {
      return res.status(404).json({
        status: "error",
        message: "ไม่พบโพสต์ที่ระบุ",
      });
    }

    if (existingPost.data.user_id.toString() !== user_id) {
      return res.status(403).json({
        status: "error",
        message: "คุณไม่มีสิทธิ์ลบโพสต์นี้",
      });
    }

    const result = await deletePost(post_id);
    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ลบโพสต์สำเร็จ",
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถลบโพสต์ได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการลบโพสต์:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.put("/update-post/:id", authenticateToken, async (req, res) => {
  try {
    const post_id = req.params.id;
    const postdata = req.body;
    const user_id = req.user._id;

    // ดึงข้อมูลโพสต์ก่อนอัปเดต
    const existingPost = await getPostbyID(post_id);
    if (!existingPost.success || !existingPost.data) {
      return res.status(404).json({
        status: "error",
        message: "ไม่พบโพสต์ที่ระบุ",
      });
    }

    // ตรวจสอบว่าเป็นเจ้าของโพสต์
    if (existingPost.data.user_id.toString() !== user_id) {
      return res.status(403).json({
        status: "error",
        message: "คุณไม่มีสิทธิ์แก้ไขโพสต์นี้ (ไม่ใช่เจ้าของ)",
      });
    }

    // ดำเนินการอัปเดต
    const result = await updatePost(post_id, postdata);
    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "อัปเดตโพสต์สำเร็จ",
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถอัปเดตโพสต์ได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตโพสต์:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.put("/join-party/:id", authenticateToken, async (req, res) => {
  try {
    const post_id = req.params.id;
    const user_id = req.user._id;
    const { position } = req.body;

    const result = await joinParty(post_id, user_id, position);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "เข้าร่วมทีมในโพสต์สำเร็จ",
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถเข้าร่วมทีมได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการเข้าร่วมทีม:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

router.put("/leave-party/:id", authenticateToken, async (req, res) => {
  try {
    const post_id = req.params.id;
    const user_id = req.user._id;

    const result = await leaveParty(post_id, user_id);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ออกจากทีมในโพสต์สำเร็จ",
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      status: "error",
      message: result.error?.message || "ไม่สามารถออกจากทีมได้",
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการออกจากทีม:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    });
  }
});

module.exports = router;
