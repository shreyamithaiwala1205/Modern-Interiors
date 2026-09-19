const express = require("express");
const router = express.Router();

const {
    getProjectCategories,
    createProjectCategory,
    updateProjectCategory,
    deleteProjectCategory,
    seedProjectCategories,
} = require("../controllers/projectCategoryController");

const {
    protect,
    admin,
} = require("../middleware/authMiddleware");

// All admin category routes protected by JWT & Admin role
router.use(protect, admin);

router.get("/", getProjectCategories);
router.post("/seed", seedProjectCategories);
router.post("/", createProjectCategory);
router.put("/:id", updateProjectCategory);
router.delete("/:id", deleteProjectCategory);

module.exports = router;
