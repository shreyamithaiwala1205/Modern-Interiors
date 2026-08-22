const express = require("express");

const router = express.Router();

const {
    protect,
} = require("../middleware/authMiddleware");

const admin =
    require("../middleware/adminMiddleware");

const {
    getAllConsultations,
    getConsultationById,
    updateConsultationStatus,
    deleteConsultation,
} = require("../controllers/consultationController");

// GET ALL
router.get(
    "/",
    protect,
    admin,
    getAllConsultations
);

// GET ONE
router.get(
    "/:id",
    protect,
    admin,
    getConsultationById
);

// UPDATE
router.put(
    "/:id",
    protect,
    admin,
    updateConsultationStatus
);

// DELETE
router.delete(
    "/:id",
    protect,
    admin,
    deleteConsultation
);

module.exports = router;