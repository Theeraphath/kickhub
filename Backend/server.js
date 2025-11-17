const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const port = 3000;

const app = express();
// Swagger
const { swaggerUi, swaggerSpec } = require("./swagger");
require("./database"); // Import the database connection
require("dotenv").config();
const apiPrivateRoutes = require("./routes/apiPrivateRoutes");
const apiRegisterRoutes = require("./routes/apiRegister");
const apiAuthRoutes = require("./routes/apiAuthRoutes");
const apiGoogleRoutes = require("./routes/authGoogle");

const allowedDomains = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://localhost:5501",
  "http://localhost:5502",
  "http://localhost:5173",
  "http://192.168.1.26:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedDomains.includes(origin)) {
      return callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  methods: [`GET`, `POST`, `PUT`, `DELETE`],
  credentials: true,
  allowedHeaders: [`Content-Type`, `Authorization`],
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors());

app.use((err, req, res, next) => {
  if (err.message === "Origin not allowed by CORS") {
    res.status(403).json({
      error: `Access denied by CORS policy does not allow access from your origin.`,
    });
  } else {
    next(err);
  }
});

app.use(
  "/uploads/photos",
  express.static(path.join(__dirname, "uploads/photos"))
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiPrivateRoutes);
app.use("/register", apiRegisterRoutes);
app.use("/login", apiAuthRoutes);
app.use("/login/google", apiGoogleRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running on port ${port}`);
});
