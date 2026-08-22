const Contact = require("../models/Contact");

// =====================================================
// CREATE CONTACT - USER
// POST /api/contact
// =====================================================

const createContact = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message,
        } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !name ||
            !email ||
            !phone ||
            !subject ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required fields.",
            });
        }

        // ==========================================
        // CREATE
        // ==========================================

        const contact = await Contact.create({
            name: String(name).trim(),

            email: String(email)
                .trim()
                .toLowerCase(),

            phone: String(phone).trim(),

            subject: String(
                subject
            ).trim(),

            message: String(
                message
            ).trim(),

            status: "Unread",
        });

        return res.status(201).json({
            success: true,
            message:
                "Message Sent Successfully.",
            contact,
        });
    } catch (error) {
        console.error(
            "CREATE CONTACT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to send message.",
        });
    }
};

// =====================================================
// GET ALL CONTACTS - ADMIN
// GET /api/admin/contacts
// =====================================================

const getAllContacts = async (
    req,
    res
) => {
    try {
        const contacts =
            await Contact.find()
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: contacts.length,
            contacts,
        });
    } catch (error) {
        console.error(
            "GET ALL CONTACTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch contacts.",
        });
    }
};

// =====================================================
// GET SINGLE CONTACT - ADMIN
// GET /api/admin/contacts/:id
// =====================================================

const getContactById = async (
    req,
    res
) => {
    try {
        const contact =
            await Contact.findById(
                req.params.id
            );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message:
                    "Contact message not found.",
            });
        }

        return res.status(200).json({
            success: true,
            contact,
        });
    } catch (error) {
        console.error(
            "GET CONTACT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch contact.",
        });
    }
};

// =====================================================
// UPDATE CONTACT STATUS - ADMIN
// PUT /api/admin/contacts/:id
// =====================================================

const updateContactStatus =
    async (req, res) => {
        try {
            const { status } =
                req.body;

            const allowedStatuses = [
                "Unread",
                "Read",
                "Replied",
            ];

            if (
                !allowedStatuses.includes(
                    status
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid contact status.",
                });
            }

            const contact =
                await Contact.findById(
                    req.params.id
                );

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Contact message not found.",
                });
            }

            contact.status = status;

            await contact.save();

            return res.status(200).json({
                success: true,
                message:
                    "Contact status updated successfully.",
                contact,
            });
        } catch (error) {
            console.error(
                "UPDATE CONTACT ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Failed to update contact.",
            });
        }
    };

// =====================================================
// DELETE CONTACT - ADMIN
// DELETE /api/admin/contacts/:id
// =====================================================

const deleteContact = async (
    req,
    res
) => {
    try {
        const contact =
            await Contact.findById(
                req.params.id
            );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message:
                    "Contact message not found.",
            });
        }

        await Contact.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Contact deleted successfully.",
        });
    } catch (error) {
        console.error(
            "DELETE CONTACT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete contact.",
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
};