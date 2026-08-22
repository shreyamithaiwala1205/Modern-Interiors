const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
} = require("../controllers/cartController");

// Add Cart
router.post("/", protect, addToCart);

// Get Cart
router.get("/", protect, getCart);

// Update Quantity
router.put("/:id", protect, updateCartQuantity);

// Remove Cart
router.delete("/:id", protect, removeFromCart);

module.exports = router;
