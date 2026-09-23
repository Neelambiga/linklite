require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const urlRoutes =
  require("./routes/urlRoutes");

const {
  redirectToOriginal
} = require("./controllers/urlController");

const errorHandler =
  require("./middleware/errorHandler");


const app = express();


// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173"
  })
);

app.use(
  express.json({
    limit: "20kb"
  })
);


// ========================================
// HEALTH CHECK
// ========================================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "LinkLite API is running",
      timestamp:
        new Date().toISOString()
    });
  }
);


// ========================================
// URL API
// ========================================

app.use(
  "/api/urls",
  urlRoutes
);


// ========================================
// SHORT URL REDIRECT
// ========================================

app.get(
  "/:shortCode",
  redirectToOriginal
);


// ========================================
// NOT FOUND
// ========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "Route not found"
    });
  }
);


// ========================================
// ERROR HANDLER
// ========================================

app.use(errorHandler);


// ========================================
// START SERVER
// ========================================

module.exports = app;