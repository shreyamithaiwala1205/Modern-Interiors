const ProjectCategory = require("../models/ProjectCategory");
const Project = require("../models/Project");

const DEFAULT_CATEGORIES = [
    { name: "Living", label: "Living Room", description: "Luxury living rooms and lounge spaces", order: 1 },
    { name: "Bedroom", label: "Bedroom", description: "Cozy and contemporary luxury bedrooms", order: 2 },
    { name: "Kitchen", label: "Modular Kitchen", description: "State-of-the-art modular kitchens", order: 3 },
    { name: "Office", label: "Office Interior", description: "Modern executive and corporate workspaces", order: 4 },
    { name: "Commercial", label: "Commercial Design", description: "Retail, restaurant, and lobby interiors", order: 5 },
    { name: "Villa", label: "Luxury Villa", description: "Expansive luxury villa and bungalow designs", order: 6 },
    { name: "Dining", label: "Dining Room", description: "Elegant dining areas and bespoke fixtures", order: 7 },
    { name: "Residential", label: "Residential", description: "Modern apartment and home architectures", order: 8 },
];

// Seed default categories if none exist or any default is missing
const seedDefaultCategories = async () => {
    try {
        for (const cat of DEFAULT_CATEGORIES) {
            const exists = await ProjectCategory.findOne({
                name: { $regex: new RegExp(`^${cat.name}$`, "i") },
            });
            if (!exists) {
                await ProjectCategory.create(cat);
                console.log(`✅ Seeded default category: ${cat.label}`);
            }
        }
    } catch (err) {
        console.error("SEED CATEGORIES ERROR:", err);
    }
};

// =====================================================
// SEED / RESET DEFAULT CATEGORIES (Admin trigger)
// POST /api/admin/project-categories/seed
// =====================================================
const seedProjectCategories = async (req, res) => {
    try {
        let insertedCount = 0;
        for (const cat of DEFAULT_CATEGORIES) {
            const exists = await ProjectCategory.findOne({
                name: { $regex: new RegExp(`^${cat.name}$`, "i") },
            });
            if (!exists) {
                await ProjectCategory.create(cat);
                insertedCount++;
            }
        }

        const allCategories = await ProjectCategory.find().sort({ order: 1, createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: insertedCount > 0
                ? `Successfully restored ${insertedCount} default categories.`
                : "All default categories are already in database.",
            categories: allCategories,
        });
    } catch (error) {
        console.error("SEED API ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to seed default categories.",
        });
    }
};

// =====================================================
// GET ALL PROJECT CATEGORIES
// GET /api/project-categories
// GET /api/admin/project-categories
// =====================================================
const getProjectCategories = async (req, res) => {
    try {
        await seedDefaultCategories();

        const categories = await ProjectCategory.find().sort({ order: 1, createdAt: 1 });

        // Get project counts per category
        const projects = await Project.find({}, "category");
        const categoryCounts = {};
        projects.forEach((p) => {
            if (p.category) {
                const norm = String(p.category).trim();
                categoryCounts[norm] = (categoryCounts[norm] || 0) + 1;
            }
        });

        const categoriesWithCount = categories.map((cat) => {
            const count = categoryCounts[cat.name] || categoryCounts[cat.label] || 0;
            return {
                ...cat.toObject(),
                projectCount: count,
            };
        });

        return res.status(200).json({
            success: true,
            count: categoriesWithCount.length,
            categories: categoriesWithCount,
        });
    } catch (error) {
        console.error("GET PROJECT CATEGORIES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch project categories.",
        });
    }
};

// =====================================================
// CREATE PROJECT CATEGORY
// POST /api/admin/project-categories
// =====================================================
const createProjectCategory = async (req, res) => {
    try {
        const { name, label, description, order } = req.body;

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name/slug is required.",
            });
        }

        const trimmedName = String(name).trim();
        const trimmedLabel = label && String(label).trim() ? String(label).trim() : trimmedName;

        // Check if category already exists
        const existing = await ProjectCategory.findOne({
            name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Category '${trimmedName}' already exists.`,
            });
        }

        const newCategory = await ProjectCategory.create({
            name: trimmedName,
            label: trimmedLabel,
            description: description ? String(description).trim() : "",
            order: order !== undefined && order !== "" ? Number(order) : 0,
        });

        return res.status(201).json({
            success: true,
            message: "Project category created successfully.",
            category: newCategory,
        });
    } catch (error) {
        console.error("CREATE PROJECT CATEGORY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create project category.",
        });
    }
};

// =====================================================
// UPDATE PROJECT CATEGORY
// PUT /api/admin/project-categories/:id
// =====================================================
const updateProjectCategory = async (req, res) => {
    try {
        const { name, label, description, order } = req.body;

        const category = await ProjectCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Project category not found.",
            });
        }

        const oldName = category.name;

        if (name && String(name).trim()) {
            const trimmedName = String(name).trim();
            // Check for conflict with other categories
            const duplicate = await ProjectCategory.findOne({
                _id: { $ne: req.params.id },
                name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: `Category name '${trimmedName}' is already taken.`,
                });
            }

            category.name = trimmedName;

            // If category name changed, update existing projects with old category name
            if (oldName !== trimmedName) {
                await Project.updateMany(
                    { category: oldName },
                    { $set: { category: trimmedName } }
                );
            }
        }

        if (label && String(label).trim()) {
            category.label = String(label).trim();
        }

        if (description !== undefined) {
            category.description = String(description).trim();
        }

        if (order !== undefined && order !== "") {
            category.order = Number(order);
        }

        const updatedCategory = await category.save();

        return res.status(200).json({
            success: true,
            message: "Project category updated successfully.",
            category: updatedCategory,
        });
    } catch (error) {
        console.error("UPDATE PROJECT CATEGORY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update project category.",
        });
    }
};

// =====================================================
// DELETE PROJECT CATEGORY
// DELETE /api/admin/project-categories/:id
// =====================================================
const deleteProjectCategory = async (req, res) => {
    try {
        const category = await ProjectCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Project category not found.",
            });
        }

        // Delete the category
        await ProjectCategory.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: `Category '${category.label || category.name}' deleted successfully.`,
        });
    } catch (error) {
        console.error("DELETE PROJECT CATEGORY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete project category.",
        });
    }
};

module.exports = {
    getProjectCategories,
    seedProjectCategories,
    createProjectCategory,
    updateProjectCategory,
    deleteProjectCategory,
    seedDefaultCategories,
};
