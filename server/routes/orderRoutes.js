const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  placeOrder,
  getMyOrders,
} = require("../controllers/orderController");

// =====================================================
// PLACE ORDER
// =====================================================

router.post(
  "/",
  protect,
  placeOrder
);

// =====================================================
// GET MY ORDERS
// =====================================================

router.get(
  "/",
  protect,
  getMyOrders
);

module.exports = router;