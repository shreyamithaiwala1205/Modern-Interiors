const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/adminReviewController");

// Get All Reviews
router.get("/", protect, admin, getAllReviews);

// Update Status
router.put("/:id", protect, admin, updateReviewStatus);

// Delete
router.delete("/:id", protect, admin, deleteReview);

module.exports = router;
