const Review = require("../models/Review");
const Furniture = require("../models/Furniture");
const Project = require("../models/Project");

const TARGET_MODELS = {
  Furniture,
  Project,
};

// ===================================
// Create Review
// POST /api/reviews
// ===================================

const createReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;

    if (!["Furniture", "Project"].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review target type",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !String(comment).trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write a comment for your review",
      });
    }

    const Model = TARGET_MODELS[targetType];

    const target = await Model.findById(targetId);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "The item you are reviewing was not found",
      });
    }

    const existing = await Review.findOne({
      user: req.user._id,
      target: targetId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this item",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      targetType,
      target: targetId,
      rating,
      comment: String(comment).trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted. It will be visible once approved.",
      review,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Get Approved Reviews For A Target
// GET /api/reviews/:targetType/:targetId
// ===================================

const getReviewsForTarget = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    if (!["Furniture", "Project"].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review target type",
      });
    }

    const reviews = await Review.find({
      target: targetId,
      status: "Approved",
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const count = reviews.length;

    const avgRating =
      count > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10
          ) / 10
        : 0;

    return res.status(200).json({
      success: true,
      count,
      avgRating,
      reviews,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Get Featured Reviews (Home Page)
// GET /api/reviews/featured
// ===================================

const getFeaturedReviews = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    const { targetType } = req.query;

    const filter = { status: "Approved" };

    if (["Furniture", "Project"].includes(targetType)) {
      filter.targetType = targetType;
    }

    const reviews = await Review.find(filter)
      .populate("user", "name")
      .populate("target", "name title")
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createReview,
  getReviewsForTarget,
  getFeaturedReviews,
};
