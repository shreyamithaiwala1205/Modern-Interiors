import React, { useState, useMemo } from "react";
import {
  Layers,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  RotateCcw,
  Sparkles,
  FolderKanban,
  CheckCircle2,
  X,
  Info,
} from "lucide-react";
import AdminLayout from "../AdminLayout";
import { useProjectCategories } from "../../context/ProjectCategoryContext";
import "../css/ProjectCategories.css";

const emptyForm = {
  name: "",
  label: "",
  description: "",
  order: "",
};

const ProjectCategories = () => {
  const {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    seedCategories,
  } = useProjectCategories();

  // Search & Filter
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("order");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered & Sorted Categories
  const filteredCategories = useMemo(() => {
    let result = Array.isArray(categories) ? [...categories] : [];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.label?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "order") {
        return (a.order ?? 99) - (b.order ?? 99);
      }
      if (sortBy === "name") {
        return (a.label || a.name || "").localeCompare(b.label || b.name || "");
      }
      if (sortBy === "projects") {
        return (b.projectCount || 0) - (a.projectCount || 0);
      }
      return 0;
    });

    return result;
  }, [categories, search, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = categories.length;
    const totalProjects = categories.reduce(
      (sum, cat) => sum + (cat.projectCount || 0),
      0
    );
    const topCategory = categories.reduce(
      (top, cat) =>
        (cat.projectCount || 0) > (top?.projectCount || 0) ? cat : top,
      null
    );

    return {
      total,
      totalProjects,
      topCategoryName: topCategory?.label || topCategory?.name || "None",
      topCategoryCount: topCategory?.projectCount || 0,
    };
  }, [categories]);

  // Handle Add Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    const result = await addCategory({
      name: formData.name.trim(),
      label: formData.label.trim() || formData.name.trim(),
      description: formData.description.trim(),
      order: formData.order !== "" ? Number(formData.order) : categories.length + 1,
    });
    setIsSubmitting(false);

    if (result.success) {
      setShowAddModal(false);
      setFormData(emptyForm);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory?._id || !formData.name.trim()) return;

    setIsSubmitting(true);
    const result = await updateCategory(selectedCategory._id, {
      name: formData.name.trim(),
      label: formData.label.trim() || formData.name.trim(),
      description: formData.description.trim(),
      order: formData.order !== "" ? Number(formData.order) : selectedCategory.order || 0,
    });
    setIsSubmitting(false);

    if (result.success) {
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData(emptyForm);
    }
  };

  // Handle Delete
  const handleDelete = async (category) => {
    const warning =
      category.projectCount > 0
        ? `Are you sure you want to delete '${category.label || category.name}'?\n\nWarning: There are ${category.projectCount} project(s) assigned to this category!`
        : `Are you sure you want to delete '${category.label || category.name}'?`;

    if (window.confirm(warning)) {
      await deleteCategory(category._id);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: "",
      label: "",
      description: "",
      order: categories.length + 1,
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || "",
      label: category.label || "",
      description: category.description || "",
      order: category.order ?? "",
    });
    setShowEditModal(true);
  };

  // Open View Modal
  const openViewModal = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  return (
    <AdminLayout>
      <div className="cat-page">
        {/* =========================
            Header
        ========================= */}
        <div className="cat-header">
          <div>
            <h1 className="cat-title">Project Categories</h1>
            <p className="cat-subtitle">
              Manage dynamic categories for projects, gallery tabs, and footer navigation.
            </p>
          </div>

          <div className="cat-header-actions">
            <button
              type="button"
              className="cat-seed-btn"
              onClick={seedCategories}
              title="Restore / Seed standard default categories"
            >
              <RotateCcw size={16} />
              <span>Restore Defaults</span>
            </button>

            <button
              type="button"
              className="cat-add-btn"
              onClick={openAddModal}
            >
              <Plus size={18} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* =========================
            Stats Cards
        ========================= */}
        <div className="cat-stats-grid">
          <div className="cat-stat-card">
            <div className="cat-stat-icon">
              <Layers size={24} />
            </div>
            <div className="cat-stat-info">
              <span>Total Categories</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="cat-stat-card">
            <div className="cat-stat-icon gold">
              <FolderKanban size={24} />
            </div>
            <div className="cat-stat-info">
              <span>Linked Projects</span>
              <strong>{stats.totalProjects}</strong>
            </div>
          </div>

          <div className="cat-stat-card">
            <div className="cat-stat-icon blue">
              <Sparkles size={24} />
            </div>
            <div className="cat-stat-info">
              <span>Top Category</span>
              <strong style={{ fontSize: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {stats.topCategoryName}
              </strong>
              <small>{stats.topCategoryCount} Projects</small>
            </div>
          </div>

          <div className="cat-stat-card">
            <div className="cat-stat-icon green">
              <CheckCircle2 size={24} />
            </div>
            <div className="cat-stat-info">
              <span>Status</span>
              <strong style={{ fontSize: "17px", color: "#22c55e" }}>Database Live</strong>
              <small>Auto-synced across app</small>
            </div>
          </div>
        </div>

        {/* =========================
            Toolbar (Search & Filters)
        ========================= */}
        <div className="cat-toolbar">
          <div className="cat-count-badge">
            Categories: <strong>{filteredCategories.length}</strong>
          </div>

          <div className="cat-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search category by name, label..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="cat-sort-box">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="order">Sort: Display Order</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="projects">Sort: Most Projects</option>
            </select>
          </div>
        </div>

        {/* =========================
            Table
        ========================= */}
        <div className="cat-table-container">
          <table className="cat-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>Category Name (Slug)</th>
                <th>Display Label</th>
                <th>Description</th>
                <th style={{ textAlign: "center" }}>Linked Projects</th>
                <th style={{ textAlign: "center", width: "160px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="cat-loading-cell">
                    <div className="cat-spinner" />
                    <span>Loading categories...</span>
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat, idx) => (
                  <tr key={cat._id || idx}>
                    <td>
                      <span className="cat-order-badge">
                        {cat.order ?? idx + 1}
                      </span>
                    </td>
                    <td>
                      <span className="cat-slug-pill">
                        {cat.name}
                      </span>
                    </td>
                    <td>
                      <strong className="cat-label-text">{cat.label || cat.name}</strong>
                    </td>
                    <td>
                      <span className="cat-desc-text">
                        {cat.description || "—"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`cat-count-pill ${cat.projectCount > 0 ? "has-items" : "empty"}`}>
                        {cat.projectCount || 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: "center" }}>
                        <button
                          type="button"
                          className="action-btn view-btn"
                          onClick={() => openViewModal(cat)}
                          title="View Details"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          className="action-btn edit-btn"
                          onClick={() => openEditModal(cat)}
                          title="Edit Category"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(cat)}
                          title="Delete Category"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="cat-empty-cell">
                    <Layers size={36} />
                    <h3>No Categories Found</h3>
                    <p>
                      {search
                        ? `No results match "${search}". Try resetting your search.`
                        : "Click 'Add Category' or 'Restore Defaults' to add categories."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =========================
            VIEW MODAL
        ========================= */}
        {showViewModal && selectedCategory && (
          <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Category Details</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowViewModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="cat-view-details">
                  <div className="cat-view-row">
                    <span className="cat-view-title">Display Label</span>
                    <strong className="cat-view-val gold">{selectedCategory.label || selectedCategory.name}</strong>
                  </div>

                  <div className="cat-view-row">
                    <span className="cat-view-title">System Slug / Name</span>
                    <span className="cat-slug-pill">{selectedCategory.name}</span>
                  </div>

                  <div className="cat-view-row">
                    <span className="cat-view-title">Display Order</span>
                    <span className="cat-order-badge">{selectedCategory.order ?? 0}</span>
                  </div>

                  <div className="cat-view-row">
                    <span className="cat-view-title">Linked Projects</span>
                    <span className="cat-count-pill has-items">{selectedCategory.projectCount || 0} Project(s)</span>
                  </div>

                  <div className="cat-view-row full">
                    <span className="cat-view-title">Description</span>
                    <p className="cat-view-desc">
                      {selectedCategory.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn modal-btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="modal-btn modal-btn-edit"
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedCategory);
                  }}
                >
                  <Pencil size={15} />
                  <span>Edit Category</span>
                </button>

                <button
                  type="button"
                  className="modal-btn modal-btn-danger"
                  onClick={() => {
                    setShowViewModal(false);
                    handleDelete(selectedCategory);
                  }}
                >
                  <Trash2 size={15} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            ADD CATEGORY MODAL
        ========================= */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Project Category</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="edit-form">
                    <div>
                      <label>Category Key / Slug * (e.g. Living, LuxuryVilla)</label>
                      <input
                        type="text"
                        placeholder="e.g. Living, Bedroom, Villa"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label>Display Label (e.g. Living Room, Luxury Villa)</label>
                      <input
                        type="text"
                        placeholder="e.g. Living Room"
                        value={formData.label}
                        onChange={(e) =>
                          setFormData({ ...formData, label: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label>Display Order (Priority Sequence)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1, 2, 3..."
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label>Description (Optional)</label>
                      <textarea
                        rows="3"
                        placeholder="Describe this project category..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn modal-btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="modal-btn modal-btn-save"
                    disabled={isSubmitting}
                  >
                    <Plus size={16} />
                    <span>{isSubmitting ? "Creating..." : "Create Category"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================
            EDIT CATEGORY MODAL
        ========================= */}
        {showEditModal && selectedCategory && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Category: {selectedCategory.label || selectedCategory.name}</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="edit-form">
                    <div className="cat-edit-notice">
                      <Info size={16} />
                      <span>
                        Note: Changing the Category Key will automatically cascade and update all linked projects.
                      </span>
                    </div>

                    <div>
                      <label>Category Key / Slug *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label>Display Label</label>
                      <input
                        type="text"
                        value={formData.label}
                        onChange={(e) =>
                          setFormData({ ...formData, label: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label>Display Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label>Description</label>
                      <textarea
                        rows="3"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn modal-btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="modal-btn modal-btn-save"
                    disabled={isSubmitting}
                  >
                    <Pencil size={15} />
                    <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProjectCategories;
