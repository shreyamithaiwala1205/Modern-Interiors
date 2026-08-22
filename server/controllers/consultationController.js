const Consultation = require("../models/Consultation");

// =====================================================
// CREATE CONSULTATION - USER
// POST /api/consultation
// =====================================================

const createConsultation = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            project,
            budget,
            date,
            time,
            message,
        } = req.body;

        // Required fields
        if (
            !name ||
            !email ||
            !phone ||
            !project ||
            !budget ||
            !date ||
            !time
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required fields.",
            });
        }

        const consultation =
            await Consultation.create({
                name: String(name).trim(),

                email: String(email)
                    .trim()
                    .toLowerCase(),

                phone: String(phone).trim(),

                project: String(project).trim(),

                budget: String(budget).trim(),

                date: String(date).trim(),

                time: String(time).trim(),

                message: message
                    ? String(message).trim()
                    : "",
            });

        return res.status(201).json({
            success: true,
            message:
                "Consultation Booked Successfully",
            consultation,
        });
    } catch (error) {
        console.error(
            "CREATE CONSULTATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to book consultation",
        });
    }
};

// =====================================================
// GET ALL CONSULTATIONS - ADMIN
// GET /api/admin/consultations
// =====================================================

const getAllConsultations = async (req, res) => {
    try {
        const consultations =
            await Consultation.find().sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: consultations.length,
            consultations,
        });
    } catch (error) {
        console.error(
            "GET ALL CONSULTATIONS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch consultations",
        });
    }
};

// =====================================================
// GET SINGLE CONSULTATION - ADMIN
// GET /api/admin/consultations/:id
// =====================================================

const getConsultationById = async (req, res) => {
    try {
        const consultation =
            await Consultation.findById(
                req.params.id
            );

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message:
                    "Consultation not found",
            });
        }

        return res.status(200).json({
            success: true,
            consultation,
        });
    } catch (error) {
        console.error(
            "GET CONSULTATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch consultation",
        });
    }
};

// =====================================================
// UPDATE CONSULTATION STATUS - ADMIN
// PUT /api/admin/consultations/:id
// =====================================================

const updateConsultationStatus = async (
    req,
    res
) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid consultation status",
            });
        }

        const consultation =
            await Consultation.findById(
                req.params.id
            );

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message:
                    "Consultation not found",
            });
        }

        consultation.status = status;

        await consultation.save();

        return res.status(200).json({
            success: true,
            message:
                "Consultation status updated successfully",
            consultation,
        });
    } catch (error) {
        console.error(
            "UPDATE CONSULTATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update consultation",
        });
    }
};

// =====================================================
// DELETE CONSULTATION - ADMIN
// DELETE /api/admin/consultations/:id
// =====================================================

const deleteConsultation = async (req, res) => {
    try {
        const consultation =
            await Consultation.findById(
                req.params.id
            );

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message:
                    "Consultation not found",
            });
        }

        await Consultation.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Consultation deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE CONSULTATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete consultation",
        });
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    createConsultation,
    getAllConsultations,
    getConsultationById,
    updateConsultationStatus,
    deleteConsultation,
};