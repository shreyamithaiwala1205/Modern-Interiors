import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import axios from "axios";

import {
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    X,
    Image as ImageIcon,
    ChevronDown,
    Check,
} from "lucide-react";

import { toast } from "react-toastify";

import AdminLayout from "../AdminLayout";
import "../css/Projects.css";

const API =
    "http://localhost:5000/api/admin/projects";

const IMAGE_BASE_URL =
    "http://localhost:5000/uploads";

const CATEGORY_OPTIONS = [
    "Residential",
    "Commercial",
    "Office",
    "Living Room",
    "Bedroom",
    "Kitchen",
    "Dining Room",
    "Bathroom",
    "Hotel",
    "Restaurant",
    "Villa",
    "Apartment",
    "Furniture",
    "Interior Design",
    "Other",
];

const EMPTY_FORM = {
    title: "",
    category: "",
    description: "",
    location: "",
    year: "",
};

const EMPTY_ERRORS = {
    title: "",
    category: "",
    description: "",
    location: "",
    year: "",
    image: "",
};

const Projects = () => {
    // =====================================================
    // DATA
    // =====================================================

    const [projects, setProjects] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    // =====================================================
    // SEARCH / FILTER
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("all");

    // =====================================================
    // MODAL
    // =====================================================

    const [modal, setModal] =
        useState(null);

    const [selectedProject, setSelectedProject] =
        useState(null);

    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] =
        useState({
            ...EMPTY_FORM,
        });

    const [errors, setErrors] =
        useState({
            ...EMPTY_ERRORS,
        });

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    // =====================================================
    // CATEGORY DROPDOWN
    // =====================================================

    const [categoryOpen, setCategoryOpen] =
        useState(false);

    const [categorySearch, setCategorySearch] =
        useState("");

    const categoryRef =
        useRef(null);

    // =====================================================
    // FETCH PROJECTS
    // =====================================================

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await axios.get(API, {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                });

            const list =
                Array.isArray(
                    response.data?.projects
                )
                    ? response.data.projects
                    : [];

            setProjects(list);
        } catch (error) {
            console.error(
                "FETCH PROJECTS ERROR:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                    "Failed to load projects."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // =====================================================
    // CLOSE CATEGORY DROPDOWN ON OUTSIDE CLICK
    // =====================================================

    useEffect(() => {
        const handleOutsideClick = (
            event
        ) => {
            if (
                categoryRef.current &&
                !categoryRef.current.contains(
                    event.target
                )
            ) {
                setCategoryOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    // =====================================================
    // DYNAMIC CATEGORIES
    // =====================================================

    const availableCategories =
        useMemo(() => {
            const existing = projects
                .map(
                    (project) =>
                        project.category
                )
                .filter(Boolean);

            return [
                ...new Set([
                    ...CATEGORY_OPTIONS,
                    ...existing,
                ]),
            ];
        }, [projects]);

    const filteredCategoryOptions =
        useMemo(() => {
            const text =
                categorySearch
                    .trim()
                    .toLowerCase();

            if (!text) {
                return availableCategories;
            }

            return availableCategories.filter(
                (category) =>
                    category
                        .toLowerCase()
                        .includes(text)
            );
        }, [
            availableCategories,
            categorySearch,
        ]);

    // =====================================================
    // PROJECT FILTER
    // =====================================================

    const filteredProjects =
        useMemo(() => {
            const text =
                search
                    .trim()
                    .toLowerCase();

            return projects.filter(
                (project) => {
                    const title =
                        String(
                            project.title ||
                                ""
                        ).toLowerCase();

                    const category =
                        String(
                            project.category ||
                                ""
                        ).toLowerCase();

                    const location =
                        String(
                            project.location ||
                                ""
                        ).toLowerCase();

                    const matchesSearch =
                        title.includes(text) ||
                        category.includes(text) ||
                        location.includes(text);

                    const matchesCategory =
                        categoryFilter ===
                        "all"
                            ? true
                            : project.category ===
                              categoryFilter;

                    return (
                        matchesSearch &&
                        matchesCategory
                    );
                }
            );
        }, [
            projects,
            search,
            categoryFilter,
        ]);

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setFormData({
            ...EMPTY_FORM,
        });

        setErrors({
            ...EMPTY_ERRORS,
        });

        setImage(null);

        setPreview("");

        setCategoryOpen(false);

        setCategorySearch("");
    };

    // =====================================================
    // OPEN ADD
    // =====================================================

    const openAdd = () => {
        resetForm();

        setSelectedProject(null);

        setModal("add");
    };

    // =====================================================
    // OPEN VIEW
    // =====================================================

    const openView = (
        project
    ) => {
        setSelectedProject(
            project
        );

        setModal("view");
    };

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEdit = (
        project
    ) => {
        setSelectedProject(
            project
        );

        setFormData({
            title:
                project.title || "",

            category:
                project.category || "",

            description:
                project.description ||
                "",

            location:
                project.location ||
                "",

            year:
                project.year || "",
        });

        setErrors({
            ...EMPTY_ERRORS,
        });

        setImage(null);

        setPreview(
            project.image
                ? `${IMAGE_BASE_URL}/${project.image}`
                : ""
        );

        setCategoryOpen(false);

        setCategorySearch("");

        setModal("edit");
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setModal(null);

        setSelectedProject(
            null
        );

        resetForm();
    };

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setErrors(
            (previous) => ({
                ...previous,
                [name]: "",
            })
        );
    };

    // =====================================================
    // CATEGORY SELECT
    // =====================================================

    const selectCategory = (
        category
    ) => {
        setFormData(
            (previous) => ({
                ...previous,
                category,
            })
        );

        setErrors(
            (previous) => ({
                ...previous,
                category: "",
            })
        );

        setCategorySearch("");

        setCategoryOpen(false);
    };

    // =====================================================
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            setErrors(
                (previous) => ({
                    ...previous,
                    image:
                        "Only JPG, JPEG, PNG and WEBP images are allowed.",
                })
            );

            event.target.value = "";

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            setErrors(
                (previous) => ({
                    ...previous,
                    image:
                        "Image size must be less than 5MB.",
                })
            );

            event.target.value = "";

            return;
        }

        setErrors(
            (previous) => ({
                ...previous,
                image: "",
            })
        );

        setImage(file);

        setPreview(
            URL.createObjectURL(
                file
            )
        );
    };

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {
        const newErrors = {
            ...EMPTY_ERRORS,
        };

        const title =
            formData.title.trim();

        const category =
            formData.category.trim();

        const description =
            formData.description.trim();

        const location =
            formData.location.trim();

        const year =
            formData.year.trim();

        // TITLE
        if (!title) {
            newErrors.title =
                "Project title is required.";
        } else if (
            title.length < 3
        ) {
            newErrors.title =
                "Project title must be at least 3 characters.";
        } else if (
            title.length > 100
        ) {
            newErrors.title =
                "Project title must be less than 100 characters.";
        }

        // CATEGORY
        if (!category) {
            newErrors.category =
                "Please select a category.";
        }

        // DESCRIPTION
        if (!description) {
            newErrors.description =
                "Project description is required.";
        } else if (
            description.length < 10
        ) {
            newErrors.description =
                "Description must be at least 10 characters.";
        } else if (
            description.length > 1000
        ) {
            newErrors.description =
                "Description must be less than 1000 characters.";
        }

        // LOCATION
        if (!location) {
            newErrors.location =
                "Project location is required.";
        } else if (
            location.length < 2
        ) {
            newErrors.location =
                "Please enter a valid location.";
        }

        // YEAR
        if (!year) {
            newErrors.year =
                "Project year is required.";
        } else if (
            !/^\d{4}$/.test(year)
        ) {
            newErrors.year =
                "Enter a valid 4-digit year.";
        } else {
            const numericYear =
                Number(year);

            if (
                numericYear <
                    2000 ||
                numericYear >
                    2100
            ) {
                newErrors.year =
                    "Year must be between 2000 and 2100.";
            }
        }

        // IMAGE
        if (
            modal === "add" &&
            !image
        ) {
            newErrors.image =
                "Project image is required.";
        }

        // DUPLICATE TITLE
        const duplicateProject =
            projects.find(
                (project) => {
                    const sameTitle =
                        String(
                            project.title ||
                                ""
                        )
                            .trim()
                            .toLowerCase() ===
                        title.toLowerCase();

                    if (
                        modal ===
                            "edit" &&
                        selectedProject
                    ) {
                        return (
                            sameTitle &&
                            project._id !==
                                selectedProject._id
                        );
                    }

                    return sameTitle;
                }
            );

        if (duplicateProject) {
            newErrors.title =
                "A project with this title already exists.";
        }

        setErrors(newErrors);

        return Object.values(
            newErrors
        ).every(
            (value) =>
                !value
        );
    };

    // =====================================================
    // SAVE
    // =====================================================

    const saveProject = async (
        event
    ) => {
        event.preventDefault();

        if (!validateForm()) {
            toast.error(
                "Please fix the highlighted fields."
            );

            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            const data =
                new FormData();

            data.append(
                "title",
                formData.title.trim()
            );

            data.append(
                "category",
                formData.category.trim()
            );

            data.append(
                "description",
                formData.description.trim()
            );

            data.append(
                "location",
                formData.location.trim()
            );

            data.append(
                "year",
                formData.year.trim()
            );

            if (image) {
                data.append(
                    "image",
                    image
                );
            }

            let response;

            if (
                modal === "edit" &&
                selectedProject?._id
            ) {
                response =
                    await axios.put(
                        `${API}/${selectedProject._id}`,
                        data,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );
            } else {
                response =
                    await axios.post(
                        API,
                        data,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );
            }

            toast.success(
                response.data?.message ||
                    "Project saved successfully."
            );

            setModal(null);

            setSelectedProject(
                null
            );

            resetForm();

            await fetchProjects();
        } catch (error) {
            console.error(
                "SAVE PROJECT ERROR:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                    "Failed to save project."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deleteProject = async (
        project
    ) => {
        const confirmed =
            window.confirm(
                `Delete project "${project.title}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await axios.delete(
                    `${API}/${project._id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            toast.success(
                response.data?.message ||
                    "Project deleted successfully."
            );

            setProjects(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item._id !==
                            project._id
                    )
            );

            if (
                selectedProject?._id ===
                project._id
            ) {
                setModal(null);

                setSelectedProject(
                    null
                );
            }
        } catch (error) {
            console.error(
                "DELETE PROJECT ERROR:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                    "Failed to delete project."
            );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <AdminLayout>
                <div className="projects-loading">
                    Loading Projects...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="projects-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="projects-header">

                    <div>
                        <h1>
                            Projects
                        </h1>

                        <p>
                            Manage your Modern Interiors gallery projects.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-project-btn"
                        onClick={
                            openAdd
                        }
                    >
                        <Plus
                            size={18}
                        />

                        Add Project
                    </button>

                </div>

                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="projects-toolbar">

                    <div className="project-search">

                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search project, category or location..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                        />

                    </div>

                    <select
                        value={
                            categoryFilter
                        }
                        onChange={(event) =>
                            setCategoryFilter(
                                event.target
                                    .value
                            )
                        }
                    >
                        <option value="all">
                            All Categories
                        </option>

                        {availableCategories.map(
                            (
                                category
                            ) => (
                                <option
                                    key={
                                        category
                                    }
                                    value={
                                        category
                                    }
                                >
                                    {
                                        category
                                    }
                                </option>
                            )
                        )}
                    </select>

                </div>

                {/* =================================================
                    PROJECT GRID
                ================================================= */}

                <div className="projects-grid">

                    {filteredProjects.length >
                    0 ? (
                        filteredProjects.map(
                            (
                                project
                            ) => (
                                <div
                                    className="project-card"
                                    key={
                                        project._id
                                    }
                                >

                                    <div className="project-image-wrapper">

                                        {project.image ? (
                                            <img
                                                src={`${IMAGE_BASE_URL}/${project.image}`}
                                                alt={
                                                    project.title
                                                }
                                                className="project-image"
                                            />
                                        ) : (
                                            <div className="project-no-image">
                                                <ImageIcon
                                                    size={
                                                        42
                                                    }
                                                />
                                            </div>
                                        )}

                                        <div className="project-category-badge">
                                            {
                                                project.category
                                            }
                                        </div>

                                    </div>

                                    <div className="project-card-body">

                                        <h3>
                                            {
                                                project.title
                                            }
                                        </h3>

                                        <p>
                                            {
                                                project.description ||
                                                "No description available."
                                            }
                                        </p>

                                        <div className="project-meta">

                                            <span>
                                                {
                                                    project.location ||
                                                    "-"
                                                }
                                            </span>

                                            <span>
                                                {
                                                    project.year ||
                                                    "-"
                                                }
                                            </span>

                                        </div>

                                        <div className="project-actions">

                                            <button
                                                type="button"
                                                className="project-view-btn"
                                                onClick={() =>
                                                    openView(
                                                        project
                                                    )
                                                }
                                            >
                                                <Eye
                                                    size={
                                                        16
                                                    }
                                                />

                                                View
                                            </button>

                                            <button
                                                type="button"
                                                className="project-edit-btn"
                                                onClick={() =>
                                                    openEdit(
                                                        project
                                                    )
                                                }
                                            >
                                                <Edit
                                                    size={
                                                        16
                                                    }
                                                />

                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="project-delete-btn"
                                                onClick={() =>
                                                    deleteProject(
                                                        project
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    size={
                                                        16
                                                    }
                                                />
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            )
                        )
                    ) : (
                        <div className="projects-empty">

                            <ImageIcon
                                size={48}
                            />

                            <h3>
                                No Projects Found
                            </h3>

                            <p>
                                Add your first gallery project.
                            </p>

                        </div>
                    )}

                </div>

            </div>

            {/* =====================================================
                MODAL
            ====================================================== */}

            {modal && (
                <div
                    className="project-modal-overlay"
                    onClick={
                        closeModal
                    }
                >

                    <div
                        className="project-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* =================================================
                            MODAL HEADER
                        ================================================= */}

                        <div className="project-modal-header">

                            <div>
                                <span>
                                    PROJECT
                                </span>

                                <h2>
                                    {modal ===
                                    "add"
                                        ? "Add Project"
                                        : modal ===
                                          "edit"
                                        ? "Edit Project"
                                        : "Project Details"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="project-close-btn"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    saving
                                }
                            >
                                <X
                                    size={20}
                                />
                            </button>

                        </div>

                        {/* =================================================
                            VIEW
                        ================================================= */}

                        {modal ===
                            "view" &&
                            selectedProject && (
                                <div className="project-view-body">

                                    <div className="project-view-image">

                                        {selectedProject.image ? (
                                            <img
                                                src={`${IMAGE_BASE_URL}/${selectedProject.image}`}
                                                alt={
                                                    selectedProject.title
                                                }
                                            />
                                        ) : (
                                            <div className="project-no-image">
                                                <ImageIcon
                                                    size={
                                                        45
                                                    }
                                                />
                                            </div>
                                        )}

                                    </div>

                                    <div className="project-view-info">

                                        <h3>
                                            {
                                                selectedProject.title
                                            }
                                        </h3>

                                        <div className="project-view-grid">

                                            <div>
                                                <span>
                                                    Category
                                                </span>

                                                <strong>
                                                    {
                                                        selectedProject.category
                                                    }
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Location
                                                </span>

                                                <strong>
                                                    {
                                                        selectedProject.location ||
                                                        "-"
                                                    }
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Year
                                                </span>

                                                <strong>
                                                    {
                                                        selectedProject.year ||
                                                        "-"
                                                    }
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="project-description-box">

                                            <span>
                                                Description
                                            </span>

                                            <p>
                                                {
                                                    selectedProject.description ||
                                                    "No description available."
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    <div className="project-modal-footer">

                                        <button
                                            type="button"
                                            className="project-modal-close"
                                            onClick={
                                                closeModal
                                            }
                                        >
                                            Close
                                        </button>

                                        <button
                                            type="button"
                                            className="project-modal-edit"
                                            onClick={() =>
                                                openEdit(
                                                    selectedProject
                                                )
                                            }
                                        >
                                            <Edit
                                                size={
                                                    16
                                                }
                                            />

                                            Edit Project
                                        </button>

                                    </div>

                                </div>
                            )}

                        {/* =================================================
                            ADD / EDIT FORM
                        ================================================= */}

                        {(modal ===
                            "add" ||
                            modal ===
                                "edit") && (
                            <form
                                className="project-form"
                                onSubmit={
                                    saveProject
                                }
                            >

                                {/* TITLE */}

                                <div className="project-form-group">

                                    <label>
                                        Project Title *
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={
                                            formData.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Modern Luxury Living Room"
                                        maxLength={
                                            100
                                        }
                                    />

                                    {errors.title && (
                                        <small className="project-form-error">
                                            {
                                                errors.title
                                            }
                                        </small>
                                    )}

                                </div>

                                {/* CATEGORY + YEAR */}

                                <div className="project-form-row">

                                    {/* CATEGORY */}

                                    <div
                                        className="project-form-group"
                                        ref={
                                            categoryRef
                                        }
                                    >
                                        <label>
                                            Category *
                                        </label>

                                        <button
                                            type="button"
                                            className={`category-select ${
                                                categoryOpen
                                                    ? "open"
                                                    : ""
                                            } ${
                                                errors.category
                                                    ? "has-error"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setCategoryOpen(
                                                    (
                                                        previous
                                                    ) =>
                                                        !previous
                                                )
                                            }
                                        >
                                            <span>
                                                {formData.category ||
                                                    "Select Category"}
                                            </span>

                                            <ChevronDown
                                                size={
                                                    17
                                                }
                                            />
                                        </button>

                                        {categoryOpen && (
                                            <div className="category-dropdown">

                                                <div className="category-search">

                                                    <Search
                                                        size={
                                                            15
                                                        }
                                                    />

                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={
                                                            categorySearch
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setCategorySearch(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        autoFocus
                                                    />

                                                </div>

                                                <div className="category-options">

                                                    {filteredCategoryOptions.length >
                                                    0 ? (
                                                        filteredCategoryOptions.map(
                                                            (
                                                                category
                                                            ) => (
                                                                <button
                                                                    type="button"
                                                                    key={
                                                                        category
                                                                    }
                                                                    className={
                                                                        formData.category ===
                                                                        category
                                                                            ? "selected"
                                                                            : ""
                                                                    }
                                                                    onClick={() =>
                                                                        selectCategory(
                                                                            category
                                                                        )
                                                                    }
                                                                >
                                                                    <span>
                                                                        {
                                                                            category
                                                                        }
                                                                    </span>

                                                                    {formData.category ===
                                                                        category && (
                                                                        <Check
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                    )}
                                                                </button>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="category-empty">
                                                            No category found.
                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        )}

                                        {errors.category && (
                                            <small className="project-form-error">
                                                {
                                                    errors.category
                                                }
                                            </small>
                                        )}
                                    </div>

                                    {/* YEAR */}

                                    <div className="project-form-group">

                                        <label>
                                            Year *
                                        </label>

                                        <input
                                            type="text"
                                            name="year"
                                            value={
                                                formData.year
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                const value =
                                                    event
                                                        .target
                                                        .value;

                                                if (
                                                    /^\d{0,4}$/.test(
                                                        value
                                                    )
                                                ) {
                                                    handleChange(
                                                        event
                                                    );
                                                }
                                            }}
                                            placeholder="2026"
                                            inputMode="numeric"
                                            maxLength={
                                                4
                                            }
                                        />

                                        {errors.year && (
                                            <small className="project-form-error">
                                                {
                                                    errors.year
                                                }
                                            </small>
                                        )}

                                    </div>

                                </div>

                                {/* LOCATION */}

                                <div className="project-form-group">

                                    <label>
                                        Location *
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Surat, Gujarat"
                                        maxLength={
                                            150
                                        }
                                    />

                                    {errors.location && (
                                        <small className="project-form-error">
                                            {
                                                errors.location
                                            }
                                        </small>
                                    )}

                                </div>

                                {/* DESCRIPTION */}

                                <div className="project-form-group">

                                    <label>
                                        Description *
                                    </label>

                                    <textarea
                                        name="description"
                                        rows="4"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Describe the interior project..."
                                        maxLength={
                                            1000
                                        }
                                    />

                                    <div className="project-text-count">
                                        {
                                            formData.description
                                                .length
                                        }
                                        /1000
                                    </div>

                                    {errors.description && (
                                        <small className="project-form-error">
                                            {
                                                errors.description
                                            }
                                        </small>
                                    )}

                                </div>

                                {/* IMAGE */}

                                <div className="project-form-group">

                                    <label>
                                        Project Image{" "}
                                        {modal ===
                                            "add" &&
                                            "*"}
                                    </label>

                                    <label
                                        htmlFor="project-image-input"
                                        className={`project-upload-box ${
                                            errors.image
                                                ? "upload-error"
                                                : ""
                                        }`}
                                    >

                                        {preview ? (
                                            <>
                                                <img
                                                    src={
                                                        preview
                                                    }
                                                    alt="Project Preview"
                                                />

                                                <div className="project-upload-overlay">
                                                    Change Image
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon
                                                    size={
                                                        36
                                                    }
                                                />

                                                <strong>
                                                    Click to upload image
                                                </strong>

                                                <span>
                                                    JPG, JPEG, PNG or WEBP
                                                </span>

                                                <span>
                                                    Maximum 5MB
                                                </span>
                                            </>
                                        )}

                                    </label>

                                    <input
                                        id="project-image-input"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={
                                            handleImageChange
                                        }
                                        hidden
                                    />

                                    {errors.image && (
                                        <small className="project-form-error">
                                            {
                                                errors.image
                                            }
                                        </small>
                                    )}

                                </div>

                                {/* FOOTER */}

                                <div className="project-modal-footer">

                                    <button
                                        type="button"
                                        className="project-modal-close"
                                        onClick={
                                            closeModal
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="project-modal-save"
                                        disabled={
                                            saving
                                        }
                                    >
                                        {saving
                                            ? "Saving..."
                                            : modal ===
                                              "edit"
                                            ? "Update Project"
                                            : "Create Project"}
                                    </button>

                                </div>

                            </form>
                        )}

                    </div>

                </div>
            )}

        </AdminLayout>
    );
};

export default Projects;