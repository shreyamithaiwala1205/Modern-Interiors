const EmailSettings = require("../models/EmailSettings");

// =====================================================
// GET EMAIL SETTINGS (ADMIN)
// =====================================================

const getEmailSettings = async (req, res) => {

    try {

        const settings =
            await EmailSettings.findOneAndUpdate(
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
            "GET EMAIL SETTINGS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch email settings",
        });
    }

};


// =====================================================
// UPDATE EMAIL SETTINGS (ADMIN)
// =====================================================

const updateEmailSettings = async (req, res) => {

    try {

        const updates = {};

        if (req.body.enabled !== undefined) {

            updates.enabled = Boolean(
                req.body.enabled
            );

        }

        const settings =
            await EmailSettings.findOneAndUpdate(
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
            message: settings.enabled
                ? "Order emails are now enabled"
                : "Order emails are now disabled",
            settings,
        });

    } catch (error) {

        console.error(
            "UPDATE EMAIL SETTINGS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update email settings",
        });
    }

};


module.exports = {
    getEmailSettings,
    updateEmailSettings,
};
