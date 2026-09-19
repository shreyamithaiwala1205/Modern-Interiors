const express = require("express");

const router = express.Router();

const {
    getHomeSettings,
} = require("../controllers/homeSettingsController");

// =====================================================
// GET HOME SETTINGS
// GET /api/home-settings
// =====================================================

router.get(
    "/",
    getHomeSettings
);

module.exports = router;
