const Coupon = require("../models/Coupon");

// =====================================================
// GET ALL COUPONS - ADMIN
// GET /api/admin/coupons
// =====================================================

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: coupons.length,
            coupons,
        });
    } catch (error) {
        console.error(
            "GET ALL COUPONS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch coupons",
        });
    }
};

// =====================================================
// GET SINGLE COUPON - ADMIN
// GET /api/admin/coupons/:id
// =====================================================

const getCouponById = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon =
            await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message:
                    "Coupon not found",
            });
        }

        return res.status(200).json({
            success: true,
            coupon,
        });
    } catch (error) {
        console.error(
            "GET SINGLE COUPON ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch coupon",
        });
    }
};

// =====================================================
// CREATE COUPON - ADMIN
// POST /api/admin/coupons
// =====================================================

const createCoupon = async (req, res) => {
    try {
        const {
            code,
            discount,
            minAmount,
            active,
        } = req.body;

        const normalizedCode =
            String(code || "")
                .trim()
                .toUpperCase();

        if (!normalizedCode) {
            return res.status(400).json({
                success: false,
                message:
                    "Coupon code is required",
            });
        }

        const discountValue =
            Number(discount);

        if (
            !Number.isFinite(
                discountValue
            ) ||
            discountValue < 1 ||
            discountValue > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Discount must be between 1 and 100",
            });
        }

        const minimumAmount =
            minAmount === undefined ||
            minAmount === null ||
            minAmount === ""
                ? 0
                : Number(minAmount);

        if (
            !Number.isFinite(
                minimumAmount
            ) ||
            minimumAmount < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Minimum amount must be 0 or greater",
            });
        }

        const existingCoupon =
            await Coupon.findOne({
                code: normalizedCode,
            });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message:
                    "Coupon code already exists",
            });
        }

        const coupon =
            await Coupon.create({
                code: normalizedCode,

                discount:
                    discountValue,

                minAmount:
                    minimumAmount,

                active:
                    active === undefined
                        ? true
                        : active === true ||
                          active === "true",
            });

        return res.status(201).json({
            success: true,
            message:
                "Coupon created successfully",
            coupon,
        });
    } catch (error) {
        console.error(
            "CREATE COUPON ERROR:",
            error
        );

        if (
            error.code === 11000
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Coupon code already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create coupon",
        });
    }
};

// =====================================================
// UPDATE COUPON - ADMIN
// PUT /api/admin/coupons/:id
// =====================================================

const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon =
            await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message:
                    "Coupon not found",
            });
        }

        // ---------------------------------------------
        // CODE
        // ---------------------------------------------

        if (
            req.body.code !== undefined
        ) {
            const newCode =
                String(
                    req.body.code
                )
                    .trim()
                    .toUpperCase();

            if (!newCode) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Coupon code is required",
                });
            }

            const duplicate =
                await Coupon.findOne({
                    code: newCode,
                    _id: {
                        $ne: coupon._id,
                    },
                });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Coupon code already exists",
                });
            }

            coupon.code = newCode;
        }

        // ---------------------------------------------
        // DISCOUNT
        // ---------------------------------------------

        if (
            req.body.discount !==
            undefined
        ) {
            const discountValue =
                Number(
                    req.body.discount
                );

            if (
                !Number.isFinite(
                    discountValue
                ) ||
                discountValue < 1 ||
                discountValue > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Discount must be between 1 and 100",
                });
            }

            coupon.discount =
                discountValue;
        }

        // ---------------------------------------------
        // MINIMUM ORDER
        // ---------------------------------------------

        if (
            req.body.minAmount !==
            undefined
        ) {
            const minimumAmount =
                Number(
                    req.body.minAmount
                );

            if (
                !Number.isFinite(
                    minimumAmount
                ) ||
                minimumAmount < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Minimum amount must be 0 or greater",
                });
            }

            coupon.minAmount =
                minimumAmount;
        }

        // ---------------------------------------------
        // ACTIVE / INACTIVE
        // ---------------------------------------------

        if (
            req.body.active !==
            undefined
        ) {
            coupon.active =
                req.body.active === true ||
                req.body.active === "true";
        }

        await coupon.save();

        return res.status(200).json({
            success: true,
            message:
                "Coupon updated successfully",
            coupon,
        });
    } catch (error) {
        console.error(
            "UPDATE COUPON ERROR:",
            error
        );

        if (
            error.code === 11000
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Coupon code already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update coupon",
        });
    }
};

// =====================================================
// DELETE COUPON - ADMIN
// DELETE /api/admin/coupons/:id
// =====================================================

const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon =
            await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message:
                    "Coupon not found",
            });
        }

        await Coupon.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message:
                "Coupon deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE COUPON ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete coupon",
        });
    }
};

// =====================================================
// APPLY COUPON - USER
// POST /api/coupon/apply
// =====================================================

const applyCoupon = async (req, res) => {
    try {
        const code =
            String(
                req.body.code || ""
            )
                .trim()
                .toUpperCase();

        const cartTotal =
            Number(
                req.body.cartTotal
            );

        if (!code) {
            return res.status(400).json({
                success: false,
                message:
                    "Coupon code is required",
            });
        }

        if (
            !Number.isFinite(
                cartTotal
            ) ||
            cartTotal < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid cart total",
            });
        }

        const coupon =
            await Coupon.findOne({
                code,
            });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message:
                    "Invalid coupon code",
            });
        }

        if (!coupon.active) {
            return res.status(400).json({
                success: false,
                message:
                    "This coupon is inactive",
            });
        }

        if (
            cartTotal <
            coupon.minAmount
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Minimum order amount is ₹${coupon.minAmount}`,
            });
        }

        const discountAmount =
            (
                cartTotal *
                coupon.discount
            ) / 100;

        const finalAmount =
            Math.max(
                cartTotal -
                    discountAmount,
                0
            );

        return res.status(200).json({
            success: true,
            message:
                "Coupon applied successfully",

            coupon: {
                _id: coupon._id,
                code: coupon.code,
                discount:
                    coupon.discount,
                minAmount:
                    coupon.minAmount,
                active:
                    coupon.active,
            },

            discountAmount,

            finalAmount,
        });
    } catch (error) {
        console.error(
            "APPLY COUPON ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to apply coupon",
        });
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
};