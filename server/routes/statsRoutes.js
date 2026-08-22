const express = require("express");

const router = express.Router();

const {
  getStats,
} = require("../controllers/statsController");

// =======================================
// Get Website Stats
// =======================================

router.get("/", getStats);

module.exports = router;