const express = require("express");

const router = express.Router();

// =====================================================
// MIDDLEWARE
// =====================================================

const {
    protect,
} = require("../middleware/authMiddleware");

const admin =
    require("../middleware/adminMiddleware");

// =====================================================
// MULTER
// =====================================================

const upload =
    require("../middleware/upload");

// =====================================================
// CONTROLLER
// =====================================================

const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

// =====================================================
// GET ALL PROJECTS
// GET /api/admin/projects
// =====================================================

router.get(
    "/",
    protect,
    admin,
    getAllProjects
);

// =====================================================
// GET SINGLE PROJECT
// GET /api/admin/projects/:id
// =====================================================

router.get(
    "/:id",
    protect,
    admin,
    getProjectById
);

// =====================================================
// CREATE PROJECT
// POST /api/admin/projects
// =====================================================

router.post(
    "/",
    protect,
    admin,
    upload.single("image"),
    createProject
);

// =====================================================
// UPDATE PROJECT
// PUT /api/admin/projects/:id
// =====================================================

router.put(
    "/:id",
    protect,
    admin,
    upload.single("image"),
    updateProject
);

// =====================================================
// DELETE PROJECT
// DELETE /api/admin/projects/:id
// =====================================================

router.delete(
    "/:id",
    protect,
    admin,
    deleteProject
);

module.exports = router;