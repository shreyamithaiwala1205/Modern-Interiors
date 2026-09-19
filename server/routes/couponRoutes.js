const express = require("express");

const router = express.Router();

const Coupon = require("../models/Coupon");

// GET ACTIVE COUPONS
router.get("/active", async (req, res) => {
    try {
        const coupons = await Coupon.find({ active: true }).sort({ discount: -1, minAmount: 1 });
        return res.status(200).json({
            success: true,
            count: coupons.length,
            coupons,
        });
    } catch (error) {
        console.error("GET ACTIVE COUPONS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch active coupons",
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const coupons = await Coupon.find({ active: true }).sort({ discount: -1, minAmount: 1 });
        return res.status(200).json({
            success: true,
            count: coupons.length,
            coupons,
        });
    } catch (error) {
        console.error("GET COUPONS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch coupons",
        });
    }
});

router.post(
    "/apply",
    async (req, res) => {
        try {
            const code =
                String(
                    req.body.code || ""
                )
                    .trim()
                    .toUpperCase();

            const rawTotal =
                req.body.cartTotal !== undefined
                    ? req.body.cartTotal
                    : req.body.totalAmount;

            const cartTotal = Number(rawTotal);

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
                (cartTotal *
                    coupon.discount) /
                100;

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

                coupon,

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
    }
);

module.exports = router;