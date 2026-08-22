const express = require("express");

const router = express.Router();

// ==========================================
// MIDDLEWARE
// ==========================================

const { protect } =
    require("../middleware/authMiddleware");

const admin =
    require("../middleware/adminMiddleware");

// ==========================================
// CONTROLLER
// ==========================================

const couponController =
    require("../controllers/couponController");

// ==========================================
// GET ALL COUPONS
// GET /api/admin/coupons
// ==========================================

router.get(
    "/",
    protect,
    admin,
    couponController.getAllCoupons
);

// ==========================================
// GET SINGLE COUPON
// GET /api/admin/coupons/:id
// ==========================================

router.get(
    "/:id",
    protect,
    admin,
    couponController.getCouponById
);

// ==========================================
// CREATE COUPON
// POST /api/admin/coupons
// ==========================================

router.post(
    "/",
    protect,
    admin,
    couponController.createCoupon
);

// ==========================================
// UPDATE COUPON
// PUT /api/admin/coupons/:id
// ==========================================

router.put(
    "/:id",
    protect,
    admin,
    couponController.updateCoupon
);

// ==========================================
// DELETE COUPON
// DELETE /api/admin/coupons/:id
// ==========================================

router.delete(
    "/:id",
    protect,
    admin,
    couponController.deleteCoupon
);

module.exports = router;