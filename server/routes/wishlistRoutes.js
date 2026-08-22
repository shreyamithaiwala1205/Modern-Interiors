const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");


// Test route
router.get("/test", (req,res)=>{
  res.json({
    message:"Wishlist Route Working"
  });
});


// Get wishlist
router.get(
  "/",
  protect,
  getWishlist
);


// Add wishlist
router.post(
  "/",
  protect,
  addToWishlist
);


// Remove wishlist
router.delete(
  "/:id",
  protect,
  removeFromWishlist
);

module.exports = router;