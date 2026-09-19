const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        // ==========================================
        // PROJECT TITLE
        // ==========================================

        title: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // CATEGORY
        // ==========================================

        category: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // DESCRIPTION
        // ==========================================

        description: {
            type: String,
            default: "",
            trim: true,
        },

        // ==========================================
        // LOCATION
        // ==========================================

        location: {
            type: String,
            default: "",
            trim: true,
        },

        // ==========================================
        // YEAR
        // ==========================================

        year: {
            type: String,
            default: "",
            trim: true,
        },

        // ==========================================
        // PROJECT IMAGE
        // ==========================================

        image: {
            type: String,
            required: true,
        },

        // ==========================================
        // RATING (cached from approved reviews)
        // ==========================================

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        reviewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "Project",
        projectSchema
    );