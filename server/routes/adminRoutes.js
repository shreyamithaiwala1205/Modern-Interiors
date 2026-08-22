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
    getDashboard,
    getRevenueChart,
    getAllUsers,
    deleteUser,
    updateUser,
} = require("../controllers/adminController");

// =====================================================
// DASHBOARD
// =====================================================

router.get(
    "/dashboard",
    protect,
    admin,
    getDashboard
);

router.get(
    "/revenue-chart",
    protect,
    admin,
    getRevenueChart
);

// =====================================================
// USERS
// =====================================================

router.get(
    "/users",
    protect,
    admin,
    getAllUsers
);

router.delete(
    "/users/:id",
    protect,
    admin,
    deleteUser
);

router.put(
    "/users/:id",
    protect,
    admin,
    updateUser
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;