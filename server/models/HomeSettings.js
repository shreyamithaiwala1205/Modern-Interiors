const mongoose = require("mongoose");

const homeSettingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "main",
            unique: true,
        },

        services: {
            type: Boolean,
            default: true,
        },

        trendingProducts: {
            type: Boolean,
            default: true,
        },

        projects: {
            type: Boolean,
            default: true,
        },

        beforeAfter: {
            type: Boolean,
            default: true,
        },

        whyChoose: {
            type: Boolean,
            default: true,
        },

        stats: {
            type: Boolean,
            default: true,
        },

        team: {
            type: Boolean,
            default: true,
        },

        testimonials: {
            type: Boolean,
            default: true,
        },

        designJourney: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "HomeSettings",
    homeSettingsSchema
);
