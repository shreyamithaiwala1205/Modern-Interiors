const express = require("express");

const router = express.Router();

// =====================================================
// MIDDLEWARE
// =====================================================

const {
    protect,
} = require("../middleware/authMiddleware");

const admin =
    require("../middleware/adminMiddleware");

// =====================================================
// CONTROLLER
// =====================================================

const {
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
} = require("../controllers/adminOrderController");

// =====================================================
// GET ALL ORDERS
// GET /api/admin/orders
// =====================================================

router.get(
    "/",
    protect,
    admin,
    getAllOrders
);

// =====================================================
// UPDATE ORDER
// PUT /api/admin/orders/:id
// =====================================================

router.put(
    "/:id",
    protect,
    admin,
    updateOrderStatus
);

// =====================================================
// DELETE ORDER
// DELETE /api/admin/orders/:id
// =====================================================

router.delete(
    "/:id",
    protect,
    admin,
    deleteOrder
);

module.exports = router;