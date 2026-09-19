import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    Search,
    Star,
    CheckCircle,
    XCircle,
    Trash2,
    RefreshCw,
    Clock3,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../AdminLayout";
import "../css/Reviews.css";

const API = "http://localhost:5000/api/admin/reviews";

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    // =====================================================
    // FETCH REVIEWS
    // =====================================================

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API, authHeaders());

            setReviews(
                Array.isArray(response.data?.reviews)
                    ? response.data.reviews
                    : []
            );
        } catch (err) {
            console.error("FETCH REVIEWS ERROR:", err);
            setError(
                err.response?.data?.message || "Failed to load reviews."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // =====================================================
    // FILTER + SEARCH
    // =====================================================

    const filteredReviews = useMemo(() => {
        const text = search.trim().toLowerCase();

        return reviews.filter((item) => {
            const userName = String(item.user?.name || "").toLowerCase();
            const targetName = String(
                item.target?.name || item.target?.title || ""
            ).toLowerCase();
            const comment = String(item.comment || "").toLowerCase();

            const matchesSearch =
                !text ||
                userName.includes(text) ||
                targetName.includes(text) ||
                comment.includes(text);

            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;

            const matchesType =
                typeFilter === "all" || item.targetType === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [reviews, search, statusFilter, typeFilter]);

    // =====================================================
    // ACTIONS
    // =====================================================

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${API}/${id}`, { status }, authHeaders());

            setReviews((prev) =>
                prev.map((r) => (r._id === id ? { ...r, status } : r))
            );

            toast.success(`Review ${status.toLowerCase()}.`);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Unable to update review."
            );
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm("Delete this review permanently?")) return;

        try {
            await axios.delete(`${API}/${id}`, authHeaders());

            setReviews((prev) => prev.filter((r) => r._id !== id));

            toast.success("Review deleted.");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Unable to delete review."
            );
        }
    };

    const getStatusClass = (status) => {
        if (status === "Approved") return "approved";
        if (status === "Rejected") return "rejected";
        return "pending";
    };

    return (
        <AdminLayout>

            <div className="reviews-admin-page">

                {/* HEADER */}

                <div className="reviews-admin-header">
                    <div>
                        <h1>Reviews</h1>
                        <p>Moderate product and project reviews.</p>
                    </div>

                    <button
                        type="button"
                        className="refresh-reviews-btn"
                        onClick={fetchReviews}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>

                {/* TOOLBAR */}

                <div className="reviews-admin-toolbar">

                    <div className="reviews-search">
                        <Search size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search user, item or comment..."
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="Furniture">Product</option>
                        <option value="Project">Project</option>
                    </select>

                </div>

                {/* TABLE */}

                {loading ? (
                    <p className="reviews-admin-status">Loading reviews...</p>
                ) : error ? (
                    <p className="reviews-admin-status error">{error}</p>
                ) : filteredReviews.length === 0 ? (
                    <p className="reviews-admin-status">No reviews found.</p>
                ) : (
                    <div className="reviews-admin-table-wrap">
                        <table className="reviews-admin-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Type</th>
                                    <th>User</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviews.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            {item.target?.name ||
                                                item.target?.title ||
                                                "Deleted Item"}
                                        </td>

                                        <td>
                                            {item.targetType === "Furniture"
                                                ? "Product"
                                                : "Project"}
                                        </td>

                                        <td>{item.user?.name || "Unknown"}</td>

                                        <td className="reviews-admin-rating">
                                            <Star size={14} />
                                            {item.rating}
                                        </td>

                                        <td
                                            className="reviews-admin-comment"
                                            title={item.comment}
                                        >
                                            {item.comment}
                                        </td>

                                        <td>
                                            <span
                                                className={`review-status-badge ${getStatusClass(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status === "Pending" && (
                                                    <Clock3 size={13} />
                                                )}
                                                {item.status === "Approved" && (
                                                    <CheckCircle size={13} />
                                                )}
                                                {item.status === "Rejected" && (
                                                    <XCircle size={13} />
                                                )}
                                                {item.status}
                                            </span>
                                        </td>

                                        <td>
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            <div className="reviews-admin-actions">

                                                {item.status !== "Approved" && (
                                                    <button
                                                        type="button"
                                                        className="approve-btn"
                                                        title="Approve"
                                                        onClick={() =>
                                                            updateStatus(
                                                                item._id,
                                                                "Approved"
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}

                                                {item.status !== "Rejected" && (
                                                    <button
                                                        type="button"
                                                        className="reject-btn"
                                                        title="Reject"
                                                        onClick={() =>
                                                            updateStatus(
                                                                item._id,
                                                                "Rejected"
                                                            )
                                                        }
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    title="Delete"
                                                    onClick={() =>
                                                        deleteReview(item._id)
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

        </AdminLayout>
    );
};

export default Reviews;
