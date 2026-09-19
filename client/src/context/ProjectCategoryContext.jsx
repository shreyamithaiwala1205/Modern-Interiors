import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProjectCategoryContext = createContext();

const FALLBACK_CATEGORIES = [
    { _id: "f1", name: "Living", label: "Living Room", description: "Luxury living rooms and lounge spaces", order: 1 },
    { _id: "f2", name: "Bedroom", label: "Bedroom", description: "Cozy and contemporary luxury bedrooms", order: 2 },
    { _id: "f3", name: "Kitchen", label: "Modular Kitchen", description: "State-of-the-art modular kitchens", order: 3 },
    { _id: "f4", name: "Office", label: "Office Interior", description: "Modern executive and corporate workspaces", order: 4 },
    { _id: "f5", name: "Commercial", label: "Commercial Design", description: "Retail, restaurant, and lobby interiors", order: 5 },
    { _id: "f6", name: "Villa", label: "Luxury Villa", description: "Expansive luxury villa and bungalow designs", order: 6 },
    { _id: "f7", name: "Dining", label: "Dining Room", description: "Elegant dining areas and bespoke fixtures", order: 7 },
    { _id: "f8", name: "Residential", label: "Residential", description: "Modern apartment and home architectures", order: 8 },
];

export const ProjectCategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/project-categories");

            if (response.data?.success && Array.isArray(response.data.categories)) {
                setCategories(response.data.categories);
            }
        } catch (err) {
            console.error("FETCH PROJECT CATEGORIES ERROR:", err);
            setError("Failed to load project categories");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Admin: Add Category
    const addCategory = async (categoryData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/api/admin/project-categories",
                categoryData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                toast.success(response.data.message || "Category created successfully!");
                await fetchCategories();
                return { success: true, category: response.data.category };
            }
            return { success: false, message: response.data?.message };
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to create category.";
            toast.error(msg);
            return { success: false, message: msg };
        }
    };

    // Admin: Update Category
    const updateCategory = async (id, categoryData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:5000/api/admin/project-categories/${id}`,
                categoryData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                toast.success(response.data.message || "Category updated successfully!");
                await fetchCategories();
                return { success: true, category: response.data.category };
            }
            return { success: false, message: response.data?.message };
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update category.";
            toast.error(msg);
            return { success: false, message: msg };
        }
    };

    // Admin: Delete Category
    const deleteCategory = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `http://localhost:5000/api/admin/project-categories/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                toast.success(response.data.message || "Category deleted successfully!");
                await fetchCategories();
                return { success: true };
            }
            return { success: false, message: response.data?.message };
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to delete category.";
            toast.error(msg);
            return { success: false, message: msg };
        }
    };

    // Admin: Seed / Restore Default Categories
    const seedCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/api/admin/project-categories/seed",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                toast.success(response.data.message || "Default categories restored!");
                await fetchCategories();
                return { success: true };
            }
            return { success: false, message: response.data?.message };
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to restore default categories.";
            toast.error(msg);
            return { success: false, message: msg };
        }
    };

    // Helper: Normalize string to category name
    const normalizeCategory = useCallback(
        (cat) => {
            if (!cat) return "Other";
            const str = String(cat).trim().toLowerCase();

            const found = categories.find(
                (c) =>
                    c.name.toLowerCase() === str ||
                    c.label.toLowerCase() === str ||
                    str.includes(c.name.toLowerCase())
            );

            return found ? found.name : cat;
        },
        [categories]
    );

    return (
        <ProjectCategoryContext.Provider
            value={{
                categories,
                loading,
                error,
                fetchCategories,
                seedCategories,
                addCategory,
                updateCategory,
                deleteCategory,
                normalizeCategory,
            }}
        >
            {children}
        </ProjectCategoryContext.Provider>
    );
};

export const useProjectCategories = () => {
    const context = useContext(ProjectCategoryContext);
    if (!context) {
        throw new Error("useProjectCategories must be used within a ProjectCategoryProvider");
    }
    return context;
};

export default ProjectCategoryContext;
