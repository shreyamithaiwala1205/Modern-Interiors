const express = require("express");

const router = express.Router();

const {
    getHomeSettings,
    updateHomeSettings,
} = require("../controllers/homeSettingsController");

const {
    protect,
    admin,
} = require("../middleware/authMiddleware");

// =====================================================
// GET HOME SETTINGS
// GET /api/admin/home-settings
// =====================================================

router.get(
    "/",
    protect,
    admin,
    getHomeSettings
);

// =====================================================
// UPDATE HOME SETTINGS
// PUT /api/admin/home-settings
// =====================================================

router.put(
    "/",
    protect,
    admin,
    updateHomeSettings
);

module.exports = router;
