const Review = require("../models/Review");
const { recomputeTargetRating } = require("../utils/reviewAggregate");

// ===================================
// Get All Reviews (Admin)
// GET /api/admin/reviews
// ===================================

const getAllReviews = async (req, res) => {
  try {
    const { status, targetType } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (targetType && targetType !== "all") {
      filter.targetType = targetType;
    }

    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("target", "name title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
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
// Update Review Status (Approve / Reject)
// PUT /api/admin/reviews/:id
// ===================================

const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.status = status;

    await review.save();

    await recomputeTargetRating(review.targetType, review.target);

    return res.status(200).json({
      success: true,
      message: "Review status updated",
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
// Delete Review
// DELETE /api/admin/reviews/:id
// ===================================

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await recomputeTargetRating(review.targetType, review.target);

    return res.status(200).json({
      success: true,
      message: "Review deleted",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
