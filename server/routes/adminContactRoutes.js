const express = require("express");

const router = express.Router();

const {
    protect,
} = require("../middleware/authMiddleware");

const admin =
    require("../middleware/adminMiddleware");

const {
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
} = require("../controllers/contactController");

// GET ALL
router.get(
    "/",
    protect,
    admin,
    getAllContacts
);

// GET SINGLE
router.get(
    "/:id",
    protect,
    admin,
    getContactById
);

// UPDATE STATUS
router.put(
    "/:id",
    protect,
    admin,
    updateContactStatus
);

// DELETE
router.delete(
    "/:id",
    protect,
    admin,
    deleteContact
);

module.exports = router;