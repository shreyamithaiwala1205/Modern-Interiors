const express = require("express");

const router = express.Router();

const {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    getProductCategories,
} = require("../controllers/adminProductController");

const {
    protect,
    admin,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// ==========================================
// GET PRODUCT CATEGORIES FROM DATABASE
// ==========================================

router.get(
    "/categories",
    protect,
    admin,
    getProductCategories
);

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
// TOGGLE PRODUCT VISIBILITY
// ==========================================

router.patch(
    "/:id/visibility",
    protect,
    admin,
    toggleProductVisibility
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