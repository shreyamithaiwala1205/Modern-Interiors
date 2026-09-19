const express = require("express");

const router = express.Router();

const {
    getEmailSettings,
    updateEmailSettings,
} = require("../controllers/emailSettingsController");

const {
    protect,
    admin,
} = require("../middleware/authMiddleware");

// =====================================================
// GET EMAIL SETTINGS
// GET /api/admin/email-settings
// =====================================================

router.get(
    "/",
    protect,
    admin,
    getEmailSettings
);

// =====================================================
// UPDATE EMAIL SETTINGS
// PUT /api/admin/email-settings
// =====================================================

router.put(
    "/",
    protect,
    admin,
    updateEmailSettings
);

module.exports = router;
