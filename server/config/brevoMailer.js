const EmailSettings = require("../models/EmailSettings");

const BREVO_API_URL =
    "https://api.brevo.com/v3/smtp/email";

// =====================================================
// CHECK IF EMAIL SENDING IS ALLOWED
// =====================================================
// Two independent switches must both be on:
//  - BREVO_ENABLED in .env (deployment-level kill switch)
//  - the admin panel toggle stored in EmailSettings (DB)

const isEmailSendingEnabled = async () => {

    if (process.env.BREVO_ENABLED === "false") {
        return false;
    }

    if (!process.env.BREVO_API_KEY) {
        return false;
    }

    try {

        const settings =
            await EmailSettings.findOneAndUpdate(
                { key: "main" },
                { $setOnInsert: { key: "main" } },
                { new: true, upsert: true }
            );

        return settings.enabled !== false;

    } catch (error) {

        console.error(
            "EMAIL SETTINGS CHECK ERROR:",
            error
        );

        // Fail safe: if the settings lookup itself
        // breaks, don't block order flow, but also
        // don't silently spam emails - default to off.
        return false;

    }

};


// =====================================================
// SEND EMAIL VIA BREVO
// =====================================================

const sendBrevoEmail = async ({
    toEmail,
    toName,
    subject,
    html,
}) => {

    try {

        const allowed =
            await isEmailSendingEnabled();

        if (!allowed) {

            console.log(
                `EMAIL SKIPPED (disabled): ${subject} -> ${toEmail}`
            );

            return {
                success: false,
                skipped: true,
            };

        }

        const response = await fetch(
            BREVO_API_URL,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type":
                        "application/json",
                    "api-key":
                        process.env.BREVO_API_KEY,
                },
                body: JSON.stringify({
                    sender: {
                        name:
                            process.env
                                .BREVO_SENDER_NAME ||
                            "Modern Interiors",
                        email: process.env
                            .BREVO_SENDER_EMAIL,
                    },
                    replyTo: {
                        email:
                            process.env
                                .BREVO_REPLY_EMAIL ||
                            process.env
                                .BREVO_SENDER_EMAIL,
                    },
                    to: [
                        {
                            email: toEmail,
                            name:
                                toName || toEmail,
                        },
                    ],
                    subject,
                    htmlContent: html,
                }),
            }
        );

        if (!response.ok) {

            const errorBody =
                await response
                    .text()
                    .catch(() => "");

            console.error(
                "BREVO SEND ERROR:",
                response.status,
                errorBody
            );

            return {
                success: false,
                status: response.status,
            };

        }

        // console.log(
        //     `EMAIL SENT: ${subject} -> ${toEmail}`
        // );

        return { success: true };

    } catch (error) {

        console.error(
            "BREVO SEND EXCEPTION:",
            error
        );

        return {
            success: false,
            error: error.message,
        };

    }

};

module.exports = {
    sendBrevoEmail,
    isEmailSendingEnabled,
};
