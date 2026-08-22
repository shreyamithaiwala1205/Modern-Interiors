const express = require("express");

const router = express.Router();

const {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/adminProductController");

const {
    protect,
    admin,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get(
    "/",
    protect,
    admin,
    getProducts
);

// ==========================================
// ADD PRODUCT
// ==========================================

router.post(
    "/",
    protect,
    admin,
    upload.single("image"),
    addProduct
);

// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put(
    "/:id",
    protect,
    admin,
    upload.single("image"),
    updateProduct
);

// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete(
    "/:id",
    protect,
    admin,
    deleteProduct
);

module.exports = router;