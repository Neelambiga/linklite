const express = require("express");

const {
  createShortUrl,
  createBulkShortUrls,
  getUrls,
  getUrlById,
  deleteUrl
} = require("../controllers/urlController");

const router = express.Router();


// GET all URLs
router.get("/", getUrls);


// Create single URL
router.post("/", createShortUrl);


// Create multiple URLs
router.post("/bulk", createBulkShortUrls);


// Get one URL
router.get("/:id", getUrlById);


// Delete URL
router.delete("/:id", deleteUrl);


module.exports = router;