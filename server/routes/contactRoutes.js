const express = require("express");

const router = express.Router();

const {
    createContact,
} = require("../controllers/contactController");

// =====================================================
// CREATE CONTACT
// POST /api/contact
// =====================================================

router.post(
    "/",
    createContact
);

module.exports = router;