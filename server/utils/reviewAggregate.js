const Review = require("../models/Review");
const Furniture = require("../models/Furniture");
const Project = require("../models/Project");

const MODELS = {
  Furniture,
  Project,
};

// Recomputes and caches the average rating + review count for a
// review target, based on its currently Approved reviews.
const recomputeTargetRating = async (targetType, targetId) => {

  const Model = MODELS[targetType];

  if (!Model) return;

  const approved = await Review.find({
    target: targetId,
    status: "Approved",
  });

  const reviewCount = approved.length;

  const rating =
    reviewCount > 0
      ? approved.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  await Model.findByIdAndUpdate(targetId, {
    rating: Math.round(rating * 10) / 10,
    reviewCount,
  });

};

module.exports = { recomputeTargetRating };
