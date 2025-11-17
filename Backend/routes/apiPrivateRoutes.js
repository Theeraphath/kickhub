const express = require("express");
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         profile_photo:
 *           type: string
 *         profile_photo_cover:
 *           type: string
 *         mobile_number:
 *           type: string
 *         status:
 *           type: string
 *         last_login:
 *           type: Date
 *     Field:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         owner_id:
 *           type: string
 *         field_name:
 *           type: string
 *         field_type:
 *           type: string
 *         mobile_number:
 *           type: string
 *         address:
 *           type: string
 *         price:
 *           type: number
 *         open:
 *           type: string
 *         close:
 *           type: string
 *         facilities:
 *           type: object
 *         image:
 *           type: string
 *         description:
 *           type: string
 *         is_active:
 *           type: boolean
 *         google_map:
 *           type: string
 *     Reservation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         field_id:
 *           type: string
 *         user_id:
 *           type: string
 *         mobile_number:
 *           type: string
 *         start_datetime:
 *           type: Date
 *         end_datetime:
 *           type: Date
 *         payment_amount:
 *           type: number
 *         payment_status:
 *           type: string
 *         status:
 *           type: string
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 665a4f0e2b6f1b0012345678
 *         party_name:
 *           type: string
 *           example: "Football Night Party"
 *         mode:
 *           type: string
 *           enum: [fixed, flexible]
 *           example: "fixed"
 *         field_id:
 *           type: string
 *           description: MongoDB ObjectId of the field
 *           example: "665a4f0e2b6f1b0012345679"
 *         field_name:
 *           type: string
 *           example: "Main Stadium"
 *         address:
 *           type: string
 *           example: "Bangkok, Thailand"
 *         user_id:
 *           type: string
 *           description: MongoDB ObjectId of the user who created the post
 *           example: "665a4f0e2b6f1b0012345680"
 *         host_name:
 *           type: string
 *           example: "Saral"
 *         host_image:
 *           type: string
 *           example: "https://example.com/images/host.png"
 *         description:
 *           type: string
 *           example: "Friendly football match with buffet style"
 *         image:
 *           type: string
 *           example: "https://example.com/images/party.png"
 *         start_datetime:
 *           type: string
 *           format: date-time
 *           example: "2025-11-18T18:00:00Z"
 *         end_datetime:
 *           type: string
 *           format: date-time
 *           example: "2025-11-18T20:00:00Z"
 *         required_positions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *                 enum: [GK, FW, DF, MF]
 *                 example: "GK"
 *               amount:
 *                 type: integer
 *                 example: 2
 *         total_required_players:
 *           type: integer
 *           example: 10
 *         participants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "665a4f0e2b6f1b0012345681"
 *               name:
 *                 type: string
 *                 example: "Player A"
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/images/playerA.png"
 *               position:
 *                 type: string
 *                 enum: [GK, FW, DF, MF, null]
 *                 example: "FW"
 *               status:
 *                 type: string
 *                 example: "Joined"
 *               joined_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-18T02:00:00Z"
 *         price:
 *           type: number
 *           example: 500
 *         google_map:
 *           type: string
 *           example: "https://maps.google.com/?q=13.7563,100.5018"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-17T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-17T12:30:00Z"
 */
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
  getReservationsByOwnerID,
} = require("../controllers/reservationController");

const {
  newPost,
  getPostbyJoinerID,
  deletePost,
  updatePost,
  getPostbyID,
  joinParty,
  leaveParty,
  getPostUpcoming,
  getPostUpcomingbyFieldID,
} = require("../controllers/postController");

///// User /////

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/user/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await getUserById(userId);

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error loading profile:", error);
    return res.status(500).json({
      status: "error",
      message: "ไม่สามารถดึงข้อมูลผู้ใช้ได้",
    });
  }
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user's profile (detailed)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Not found
 */
router.get("/user/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "ไม่พบข้อมูลผู้ใช้",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "ดึงข้อมูลผู้ใช้สำเร็จ",
      data: user,
    });
  } catch (err) {
    console.error("❌ Error in /user/profile:", err);
    return res.status(500).json({
      status: "error",
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
    });
  }
});

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update a user's profile (multipart/form-data)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *               profile_photo_cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Bad request
 */
router.put(
  "/user/update/:id",
  authenticateToken,
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "profile_photo_cover", maxCount: 1 },
  ]),
  updateUserProfile
);

/**
 * @swagger
 * /user/change-password/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Bad request
 */
router.put("/user/change-password/:id", authenticateToken, changePassword);

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
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

/////////////////////////////////////////
/////////// Field /////////
/**
 * @swagger
 * /add-fields:
 *   post:
 *     tags:
 *       - Field
 *     summary: Add a new field (owner only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Field created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Field'
 */
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
        // ❗ เก็บเฉพาะชื่อไฟล์เท่านั้น
        image: req.file ? req.file.filename : null,
      };

      const result = await addField(fieldData);

      if (result.success) {
        return res.status(201).json({
          status: "success",
          message: "เพิ่มข้อมูลสนามสำเร็จ",
          data: result.data,
        });
      }

      return res.status(400).json({
        status: "error",
        message: result.error?.message || "ไม่สามารถเพิ่มข้อมูลสนามได้",
      });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มสนาม:", err);
      return res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      });
    }
  }
);

/**
 * @swagger
 * /fields:
 *   get:
 *     tags:
 *       - Field
 *     summary: Get all fields
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Field'
 */
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

/**
 * @swagger
 * /fields/{id}:
 *   get:
 *     tags:
 *       - Field
 *     summary: Get field by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Field found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Field'
 *       404:
 *         description: Field not found
 */
router.get("/fields/:id", authenticateToken, async (req, res) => {
  try {
    const fieldId = req.params.id;
    const result = await getFieldbyID(fieldId);

    if (result.success) {
      return res
        .status(200)
        .json({
          status: "success",
          message: "ดึงข้อมูลสนามสำเร็จ",
          data: result.data,
        });
    }
    return res
      .status(404)
      .json({
        status: "error",
        message: result.error?.message || "ไม่พบข้อมูลสนามที่ระบุ",
      });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดที่ไม่คาดคิดในการดึงข้อมูลสนามด้วย ID:", err);
    return res
      .status(500)
      .json({ status: "error", message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

/**
 * @swagger
 * /available-fields:
 *   get:
 *     tags:
 *       - Field
 *     summary: Get fields available in a time range
 *     parameters:
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: string
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Available fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Field'
 */
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

/**
 * @swagger
 * /owner-fields:
 *   get:
 *     tags:
 *       - Field
 *     summary: Get fields owned by authenticated owner
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner fields list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Field'
 */
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

/**
 * @swagger
 * /update-fields/{id}:
 *   put:
 *     tags:
 *       - Field
 *     summary: Update a field (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Field updated
 */
router.put(
  "/update-fields/:id",
  authenticateToken,
  authorizeOwner,
  upload.single("image"),
  async (req, res) => {
    try {
      const fieldId = req.params.id;

      // ดึงข้อมูลเดิม
      const existingField = await getFieldbyID(fieldId);
      if (!existingField.success || !existingField.data) {
        return res.status(404).json({
          status: "error",
          message: "ไม่พบข้อมูลสนาม",
        });
      }

      // ตรวจสอบสิทธิ์เจ้าของ
      if (existingField.data.owner_id.toString() !== req.user._id) {
        return res.status(403).json({
          status: "error",
          message: "ไม่มีสิทธิ์แก้ไขสนามนี้",
        });
      }

      // ❗ เตรียมข้อมูลใหม่
      const fieldData = {
        ...req.body,
      };

      // ❗ ถ้ามีรูปใหม่ → เก็บชื่อไฟล์ใหม่ (ไม่เอา path)
      if (req.file) {
        fieldData.image = req.file.filename;
      }

      const result = await updateField(fieldId, fieldData);

      if (result.success) {
        return res.status(200).json({
          status: "success",
          message: "อัปเดตข้อมูลสนามสำเร็จ",
          data: result.data,
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

/**
 * @swagger
 * /delete-fields/{id}:
 *   delete:
 *     tags:
 *       - Field
 *     summary: Delete a field (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Field deleted
 */
router.delete(
  "/delete-fields/:id",
  authenticateToken,
  authorizeOwner,
  async (req, res) => {
    try {
      const fieldId = req.params.id;
      const existingField = await getFieldbyID(fieldId);
      if (!existingField.success || !existingField.data) {
        return res
          .status(404)
          .json({ status: "error", message: "ไม่พบข้อมูลสนามที่ต้องการลบ" });
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
      return res
        .status(500)
        .json({ status: "error", message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
  }
);

/////////////////////////////////////////
/////// reservation ////////////////////

/**
 * @swagger
 * /new-reservation/{id}:
 *   post:
 *     tags:
 *       - reservation
 *     summary: Create a new reservation for a field
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Field id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reservation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
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

/**
 * @swagger
 * /reservations:
 *   get:
 *     tags:
 *       - reservation
 *     summary: Get all reservations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 */
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

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     tags:
 *       - reservation
 *     summary: Get reservation by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
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

/**
 * @swagger
 * /user-reservations:
 *   get:
 *     tags:
 *       - reservation
 *     summary: Get reservations for authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 */
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

/**
 * @swagger
 * /reservations/field/owner:
 *   get:
 *     tags:
 *       - reservation
 *     summary: Get reservations for fields owned by authenticated owner
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner reservations
 */
router.get(
  "/reservations/field/owner",
  authenticateToken,
  authorizeOwner,
  async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: ไม่พบข้อมูลผู้ใช้",
        });
      }

      const ownerId = req.user._id;
      console.log("Owner ID:", ownerId);

      const result = await getReservationsByOwnerID(ownerId);

      if (!result.success) {
        return res.status(404).json({
          status: "error",
          message: result.error || "ไม่สามารถดึงข้อมูลการจองของเจ้าของสนามได้",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลการจองของเจ้าของสนามสำเร็จ",
        data: result.data,
        count: Array.isArray(result.data) ? result.data.length : 0,
        hasData: Array.isArray(result.data) ? result.data.length > 0 : false,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Owner reservation error:", err);
      return res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      });
    }
  }
);

/**
 * @swagger
 * /field-reservations/{id}:
 *   get:
 *     tags:
 *       - reservation
 *     summary: Get reservations for a specific field
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Field reservations
 */
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

/**
 * @swagger
 * /update-reservation/{id}:
 *   put:
 *     tags:
 *       - reservation
 *     summary: Update reservation by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Reservation updated
 */
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

/////////////////////////////////////////
///////// POST //////////////////////////

/**
 * @swagger
 * /create-post/{id}:
 *   post:
 *     tags:
 *       - POST
 *     summary: Create a post for a field
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Field id
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post(
  "/create-post/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      // ================================
      // ⭐ DEBUG LOG สำคัญ (เพิ่มตรงนี้)
      // ================================
      console.log("🔥🔥🔥 CREATE POST REQUEST RECEIVED 🔥🔥🔥");
      console.log("👉 Headers:", req.headers);
      console.log("👉 Params:", req.params);
      console.log("👉 Body:", req.body);
      console.log("👉 File:", req.file);
      console.log("👉 User from Token:", req.user);
      // ================================
      // END DEBUG LOG
      // ================================

      const field_id = req.params.id;
      const user_id = req.user._id;

      let postdata = {};

      // -----------------------
      // JSON MODE
      // -----------------------
      if (req.headers["content-type"]?.includes("application/json")) {
        console.log("📌 JSON MODE ACTIVE");
        postdata = req.body;
        postdata.image = null;
      }

      // -----------------------
      // FORM-DATA MODE
      // -----------------------
      else {
        console.log("📌 FORM-DATA MODE ACTIVE");

        postdata = {
          ...req.body,
          image: req.file ? req.file.filename : null,
        };

        if (postdata.required_positions) {
          try {
            postdata.required_positions = JSON.parse(
              postdata.required_positions
            );
          } catch (err) {
            console.log("❌ required_positions parse error");
          }
        }
      }

      // ⭐ LOG postdata ที่จะส่งเข้า newPost
      console.log("👉 Final postdata to newPost:", postdata);

      // ส่งให้ newPost
      const result = await newPost(user_id, field_id, postdata);

      if (result.success) {
        console.log("✅ POST CREATED SUCCESSFULLY");
        return res.status(201).json({
          status: "success",
          message: "สร้างโพสต์สำเร็จ",
          data: result.data,
        });
      }

      console.log("❌ newPost FAILED:", result.error);

      return res.status(400).json({
        status: "error",
        message: result.error?.message || "ไม่สามารถสร้างโพสต์ได้",
      });
    } catch (error) {
      console.error("❌ create-post error:", error);
      return res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      });
    }
  }
);

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - POST
 *     summary: Get upcoming posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */
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

/**
 * @swagger
 * /posts/joiner:
 *   get:
 *     tags:
 *       - POST
 *     summary: Get posts the authenticated user has joined
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Joined posts list
 */
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

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     tags:
 *       - POST
 *     summary: Get a post by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post found
 */
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

/**
 * @swagger
 * /posts-field/{id}:
 *   get:
 *     tags:
 *       - POST
 *     summary: Get posts for a specific field on a specific date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts for field
 */
router.get("/posts-field/:id", authenticateToken, async (req, res) => {
  try {
    const fieldId = req.params.id;
    const date = req.query.date;

    console.log("📌 GET posts-field", { fieldId, date });

    if (!date) {
      return res.status(400).json({
        status: "error",
        message: "กรุณาส่งวันที่ เช่น ?date=2025-11-09",
      });
    }

    const result = await getPostUpcomingbyFieldID(fieldId, date);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "ดึงข้อมูลโพสต์สำเร็จ",
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

/**
 * @swagger
 * /delete-post/{id}:
 *   delete:
 *     tags:
 *       - POST
 *     summary: Delete a post (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 */
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

/**
 * @swagger
 * /update-post/{id}:
 *   put:
 *     tags:
 *       - POST
 *     summary: Update a post (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Post updated
 */
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

/**
 * @swagger
 * /join-party/{id}:
 *   put:
 *     tags:
 *       - POST
 *     summary: Join a post/team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *     responses:
 *       200:
 *         description: Joined successfully
 */
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

/**
 * @swagger
 * /leave-party/{id}:
 *   put:
 *     tags:
 *       - POST
 *     summary: Leave a post/team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Left successfully
 */
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
