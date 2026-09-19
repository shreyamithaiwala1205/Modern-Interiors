const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createReview,
  getReviewsForTarget,
  getFeaturedReviews,
} = require("../controllers/reviewController");

// Create Review
router.post("/", protect, createReview);

// Featured Reviews (Home Page)
router.get("/featured", getFeaturedReviews);

// Get Reviews For A Target
router.get("/:targetType/:targetId", getReviewsForTarget);

module.exports = router;
