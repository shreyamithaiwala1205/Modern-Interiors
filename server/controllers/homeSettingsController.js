const HomeSettings = require("../models/HomeSettings");

// =====================================================
// GET HOME SETTINGS (PUBLIC)
// =====================================================

const getHomeSettings = async (req, res) => {

    try {

        const settings =
            await HomeSettings.findOneAndUpdate(
                { key: "main" },
                { $setOnInsert: { key: "main" } },
                {
                    new: true,
                    upsert: true,
                }
            );

        return res.status(200).json({
            success: true,
            settings,
        });

    } catch (error) {

        console.error(
            "GET HOME SETTINGS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch home settings",
        });
    }

};


// =====================================================
// UPDATE HOME SETTINGS (ADMIN)
// =====================================================

const updateHomeSettings = async (req, res) => {

    try {

        const allowedFields = [
            "services",
            "trendingProducts",
            "projects",
            "beforeAfter",
            "whyChoose",
            "stats",
            "team",
            "testimonials",
            "designJourney",
        ];

        const updates = {};

        allowedFields.forEach((field) => {

            if (req.body[field] !== undefined) {

                updates[field] = Boolean(
                    req.body[field]
                );

            }

        });

        const settings =
            await HomeSettings.findOneAndUpdate(
                { key: "main" },
                {
                    $set: updates,
                    $setOnInsert: { key: "main" },
                },
                {
                    new: true,
                    upsert: true,
                }
            );

        return res.status(200).json({
            success: true,
            message:
                "Home page settings updated successfully",
            settings,
        });

    } catch (error) {

        console.error(
            "UPDATE HOME SETTINGS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update home settings",
        });
    }

};


module.exports = {
    getHomeSettings,
    updateHomeSettings,
};
