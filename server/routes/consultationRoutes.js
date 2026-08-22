const express = require("express");

const router = express.Router();

const {
    createConsultation,
} = require("../controllers/consultationController");

// =====================================================
// CREATE CONSULTATION - USER
// POST /api/consultation
// =====================================================

router.post(
    "/",
    createConsultation
);

module.exports = router;