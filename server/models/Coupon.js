const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        discount: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },

        minAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "Coupon",
        couponSchema
    );