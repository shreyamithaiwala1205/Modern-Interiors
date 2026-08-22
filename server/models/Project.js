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