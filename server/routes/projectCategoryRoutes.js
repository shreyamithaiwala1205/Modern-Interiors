const express = require("express");
const router = express.Router();

const {
    getProjectCategories,
} = require("../controllers/projectCategoryController");

// Public route to get all project categories
router.get("/", getProjectCategories);

module.exports = router;
