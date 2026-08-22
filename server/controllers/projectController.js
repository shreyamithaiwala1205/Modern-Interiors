const Project = require("../models/Project");

// =====================================================
// GET ALL PROJECTS
// GET /api/projects
// GET /api/admin/projects
// =====================================================

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        console.error(
            "GET ALL PROJECTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch projects.",
        });
    }
};

// =====================================================
// GET SINGLE PROJECT
// GET /api/admin/projects/:id
// =====================================================

const getProjectById = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        return res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error(
            "GET PROJECT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch project.",
        });
    }
};

// =====================================================
// CREATE PROJECT
// POST /api/admin/projects
// =====================================================

const createProject = async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            location,
            year,
        } = req.body;

        if (
            !title ||
            !String(title).trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Project title is required.",
            });
        }

        if (
            !category ||
            !String(category).trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Project category is required.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "Project image is required.",
            });
        }

        const project =
            await Project.create({
                title:
                    String(title).trim(),

                category:
                    String(category).trim(),

                description:
                    description
                        ? String(
                              description
                          ).trim()
                        : "",

                location:
                    location
                        ? String(
                              location
                          ).trim()
                        : "",

                year:
                    year
                        ? String(year).trim()
                        : "",

                image:
                    req.file.filename,
            });

        return res.status(201).json({
            success: true,
            message:
                "Project created successfully.",
            project,
        });
    } catch (error) {
        console.error(
            "CREATE PROJECT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create project.",
        });
    }
};

// =====================================================
// UPDATE PROJECT
// PUT /api/admin/projects/:id
// =====================================================

const updateProject = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message:
                    "Project not found.",
            });
        }

        if (
            req.body.title !== undefined
        ) {
            project.title =
                String(
                    req.body.title
                ).trim();
        }

        if (
            req.body.category !==
            undefined
        ) {
            project.category =
                String(
                    req.body.category
                ).trim();
        }

        if (
            req.body.description !==
            undefined
        ) {
            project.description =
                String(
                    req.body.description
                ).trim();
        }

        if (
            req.body.location !==
            undefined
        ) {
            project.location =
                String(
                    req.body.location
                ).trim();
        }

        if (
            req.body.year !==
            undefined
        ) {
            project.year =
                String(
                    req.body.year
                ).trim();
        }

        if (req.file) {
            project.image =
                req.file.filename;
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message:
                "Project updated successfully.",
            project,
        });
    } catch (error) {
        console.error(
            "UPDATE PROJECT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update project.",
        });
    }
};

// =====================================================
// DELETE PROJECT
// DELETE /api/admin/projects/:id
// =====================================================

const deleteProject = async (req, res) => {
    try {
        const project =
            await Project.findById(
                req.params.id
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message:
                    "Project not found.",
            });
        }

        await Project.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Project deleted successfully.",
        });
    } catch (error) {
        console.error(
            "DELETE PROJECT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete project.",
        });
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};