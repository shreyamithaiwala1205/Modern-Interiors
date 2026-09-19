const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: String,
            required: true,
            trim: true,
        },

        priceValue: {
            type: Number,
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        material: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            required: true,
        },

        rating: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
        },

        reviewCount: {
            type: Number,
            default: 0,
        },

        stock: {
            type: Number,
            required: true,
            default: 10,
            min: 0,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        colors: [
            {
                type: String,
            },
        ],

        dimensions: {
            type: String,
            default: "",
        },

        warranty: {
            type: String,
            default: "",
        },

        delivery: {
            type: String,
            default: "",
        },

        features: [
            {
                type: String,
            },
        ],

        isVisible: {
            type: Boolean,
            default: true,
        },

        autoHiddenDueToStock: {
            type: Boolean,
            default: false,
        },

        tags: {
            type: [String],
            default: [],
        },

    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "Furniture",
        furnitureSchema
    );