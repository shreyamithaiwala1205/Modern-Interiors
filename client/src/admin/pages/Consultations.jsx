import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    Eye,
    Trash2,
    Search,
    CalendarDays,
    Clock3,
    UserRound,
    CheckCircle,
    CircleAlert,
    CircleX,
    RefreshCw,
    X,
    Download,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../AdminLayout";
import "../css/Consultations.css";

const API =
    "http://localhost:5000/api/admin/consultations";

const Consultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedConsultation, setSelectedConsultation] =
        useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const consultationsPerPage = 5;

    // =====================================================
    // FETCH CONSULTATIONS
    // =====================================================

    const fetchConsultations = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(API, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setConsultations(
                Array.isArray(response.data?.consultations)
                    ? response.data.consultations
                    : []
            );
        } catch (error) {
            console.error(
                "FETCH CONSULTATIONS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to load consultations."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultations();
    }, []);

    // =====================================================
    // FILTER + SEARCH
    // =====================================================

    const filteredConsultations = useMemo(() => {
        const text = search.trim().toLowerCase();

        return consultations.filter((item) => {
            const name = String(item.name || "").toLowerCase();
            const email = String(item.email || "").toLowerCase();
            const phone = String(item.phone || "").toLowerCase();
            const project = String(item.project || "").toLowerCase();

            const matchesSearch =
                name.includes(text) ||
                email.includes(text) ||
                phone.includes(text) ||
                project.includes(text);

            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [consultations, search, statusFilter]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        filteredConsultations.length / consultationsPerPage
    );

    const indexOfLast =
        currentPage * consultationsPerPage;

    const indexOfFirst =
        indexOfLast - consultationsPerPage;

    const currentConsultations =
        filteredConsultations.slice(
            indexOfFirst,
            indexOfLast
        );

    // Keep page valid after delete/filter
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }

        if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // =====================================================
    // STATS
    // =====================================================

    const total = consultations.length;

    const pending = consultations.filter(
        (item) => item.status === "Pending"
    ).length;

    const confirmed = consultations.filter(
        (item) => item.status === "Confirmed"
    ).length;

    const completed = consultations.filter(
        (item) => item.status === "Completed"
    ).length;

    const cancelled = consultations.filter(
        (item) => item.status === "Cancelled"
    ).length;

    // =====================================================
    // EXPORT CSV
    // =====================================================

    const exportCSV = () => {
        if (filteredConsultations.length === 0) {
            toast.error(
                "No consultations available to export."
            );
            return;
        }

        const headers = [
            "No.",
            "Customer Name",
            "Email",
            "Phone",
            "Project",
            "Budget",
            "Date",
            "Time",
            "Status",
            "Message",
        ];

        const rows = filteredConsultations.map(
            (item, index) => [
                index + 1,
                item.name || "",
                item.email || "",
                item.phone || "",
                item.project || "",
                item.budget || "",
                item.date || "",
                item.time || "",
                item.status || "",
                item.message || "",
            ]
        );

        const csvContent = [headers, ...rows]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value).replace(
                                /"/g,
                                '""'
                            )}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `consultations-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success(
            "Consultations exported successfully."
        );
    };

    // =====================================================
    // VIEW
    // =====================================================

    const viewConsultation = (consultation) => {
        setSelectedConsultation(consultation);
        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        setSelectedConsultation(null);
        setShowModal(false);
    };

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const updateStatus = async (id, status) => {
        try {
            const token =
                localStorage.getItem("token");

            const response = await axios.put(
                `${API}/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                response.data?.message ||
                    "Consultation status updated."
            );

            setConsultations((previous) =>
                previous.map((item) =>
                    item._id === id
                        ? {
                              ...item,
                              status,
                          }
                        : item
                )
            );

            if (
                selectedConsultation?._id === id
            ) {
                setSelectedConsultation(
                    (previous) => ({
                        ...previous,
                        status,
                    })
                );
            }
        } catch (error) {
            console.error(
                "UPDATE CONSULTATION ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to update status."
            );
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deleteConsultation = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this consultation?"
        );

        if (!confirmed) return;

        try {
            const token =
                localStorage.getItem("token");

            const response = await axios.delete(
                `${API}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                response.data?.message ||
                    "Consultation deleted successfully."
            );

            setConsultations((previous) =>
                previous.filter(
                    (item) => item._id !== id
                )
            );

            if (
                selectedConsultation?._id === id
            ) {
                closeModal();
            }
        } catch (error) {
            console.error(
                "DELETE CONSULTATION ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to delete consultation."
            );
        }
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "Confirmed":
                return "confirmed";

            case "Completed":
                return "completed";

            case "Cancelled":
                return "cancelled";

            default:
                return "pending";
        }
    };

    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {
        switch (status) {
            case "Confirmed":
                return <CheckCircle size={14} />;

            case "Completed":
                return <CheckCircle size={14} />;

            case "Cancelled":
                return <CircleX size={14} />;

            default:
                return <CircleAlert size={14} />;
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <AdminLayout>
                <div className="consultations-page">
                    <div className="consultations-loading">
                        <div className="consultations-loader"></div>

                        <h2>
                            Loading Consultations...
                        </h2>

                        <p>
                            Please wait while consultation
                            data is loading.
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <AdminLayout>
                <div className="consultations-error">
                    <CircleX size={42} />

                    <h2>{error}</h2>

                    <button
                        type="button"
                        onClick={fetchConsultations}
                    >
                        Try Again
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="consultations-page">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="consultations-header">
                    <div>
                        <h1>Consultations</h1>

                        <p>
                            Manage customer consultation
                            requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="refresh-consultations-btn"
                        onClick={fetchConsultations}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>

                {/* =================================================
                    STATS
                ================================================= */}

                <div className="consultations-stats">

                    <div className="consultation-stat-card">
                        <UserRound size={24} />

                        <div>
                            <span>Total</span>
                            <strong>{total}</strong>
                        </div>
                    </div>

                    <div className="consultation-stat-card pending">
                        <CircleAlert size={24} />

                        <div>
                            <span>Pending</span>
                            <strong>{pending}</strong>
                        </div>
                    </div>

                    <div className="consultation-stat-card confirmed">
                        <CheckCircle size={24} />

                        <div>
                            <span>Confirmed</span>
                            <strong>{confirmed}</strong>
                        </div>
                    </div>

                    <div className="consultation-stat-card completed">
                        <CheckCircle size={24} />

                        <div>
                            <span>Completed</span>
                            <strong>{completed}</strong>
                        </div>
                    </div>

                    <div className="consultation-stat-card cancelled">
                        <CircleX size={24} />

                        <div>
                            <span>Cancelled</span>
                            <strong>{cancelled}</strong>
                        </div>
                    </div>

                </div>

                {/* =================================================
                    TOOLBAR
                ================================================= */}
<div className="consultations-toolbar">

    {/* LEFT SIDE */}
    <div className="consultations-toolbar-left">

        <div className="consultations-total">
            Total Consultations : {" "}
            <strong>{filteredConsultations.length}</strong>
        </div>

        <button
            type="button"
            className="export-consultations-btn"
            onClick={exportCSV}
        >
            <Download size={17} />
            Export CSV
        </button>

    </div>

    {/* RIGHT SIDE */}
    <div className="consultations-toolbar-right">

        <div className="consultation-search">
            <Search size={18} />

            <input
                type="text"
                placeholder="Search consultations..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
            />
        </div>

        <select
            value={statusFilter}
            onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
            }}
        >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
        </select>

    </div>

</div>

                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="consultations-table-container">

                    <table className="consultations-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Project</th>
                                <th>Budget</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {currentConsultations.length > 0 ? (
                                currentConsultations.map(
                                    (item, index) => (
                                        <tr
                                            key={
                                                item._id
                                            }
                                        >
                                            <td>
                                                {indexOfFirst +
                                                    index +
                                                    1}
                                            </td>

                                            <td>
                                                <div className="consultation-customer">

                                                    <div className="consultation-avatar">
                                                        {(item.name ||
                                                            "U")
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {
                                                                item.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                item.email
                                                            }
                                                        </span>

                                                        <small>
                                                            {
                                                                item.phone
                                                            }
                                                        </small>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <span className="project-name">
                                                    {
                                                        item.project
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {item.budget ||
                                                    "-"}
                                            </td>

                                            <td>
                                                <div className="date-cell">
                                                    <CalendarDays
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    {
                                                        item.date
                                                    }
                                                </div>
                                            </td>

                                            <td>
                                                <div className="time-cell">
                                                    <Clock3
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    {
                                                        item.time
                                                    }
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={`consultation-status ${getStatusClass(
                                                        item.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        item.status
                                                    )}

                                                    {
                                                        item.status
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <div className="consultation-actions">

                                                    <button
                                                        type="button"
                                                        className="consultation-view-btn"
                                                        onClick={() =>
                                                            viewConsultation(
                                                                item
                                                            )
                                                        }
                                                        title="View"
                                                    >
                                                        <Eye
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="consultation-delete-btn"
                                                        onClick={() =>
                                                            deleteConsultation(
                                                                item._id
                                                            )
                                                        }
                                                        title="Delete"
                                                    >
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="no-consultations"
                                    >
                                        No consultations found.
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}

{filteredConsultations.length > 0 && (
    <div className="consultations-pagination">

        <button
            type="button"
            className="pagination-arrow"
            disabled={currentPage === 1}
            onClick={() =>
                setCurrentPage((page) => page - 1)
            }
        >
            &lt;
        </button>

        {Array.from(
            { length: totalPages },
            (_, index) => (
                <button
                    key={index}
                    type="button"
                    className={
                        currentPage === index + 1
                            ? "active-page"
                            : ""
                    }
                    onClick={() =>
                        setCurrentPage(index + 1)
                    }
                >
                    {index + 1}
                </button>
            )
        )}

        <button
            type="button"
            className="pagination-arrow"
            disabled={currentPage === totalPages}
            onClick={() =>
                setCurrentPage((page) => page + 1)
            }
        >
            &gt;
        </button>

    </div>
)}

            </div>

            {/* =====================================================
                VIEW MODAL
            ====================================================== */}

            {showModal &&
                selectedConsultation && (
                    <div
                        className="consultation-modal-overlay"
                        onClick={closeModal}
                    >
                        <div
                            className="consultation-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="consultation-modal-header">

                                <div>
                                    <span>
                                        CONSULTATION DETAILS
                                    </span>

                                    <h2>
                                        {
                                            selectedConsultation.name
                                        }
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="consultation-close-btn"
                                    onClick={closeModal}
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            <div className="consultation-modal-body">

                                <div className="consultation-detail-grid">

                                    <div className="consultation-detail-card">
                                        <span>
                                            Customer Name
                                        </span>
                                        <strong>
                                            {
                                                selectedConsultation.name
                                            }
                                        </strong>
                                    </div>

                                    <div className="consultation-detail-card">
                                        <span>
                                            Email
                                        </span>
                                        <strong>
                                            {
                                                selectedConsultation.email
                                            }
                                        </strong>
                                    </div>

                                    <div className="consultation-detail-card">
                                        <span>
                                            Phone
                                        </span>
                                        <strong>
                                            {
                                                selectedConsultation.phone
                                            }
                                        </strong>
                                    </div>

                                    <div className="consultation-detail-card">
                                        <span>
                                            Project
                                        </span>
                                        <strong>
                                            {
                                                selectedConsultation.project
                                            }
                                        </strong>
                                    </div>

                                    <div className="consultation-detail-card">
                                        <span>
                                            Budget
                                        </span>
                                        <strong>
                                            {
                                                selectedConsultation.budget ||
                                                "-"
                                            }
                                        </strong>
                                    </div>

                                    <div className="consultation-detail-card">
                                        <span>
                                            Date
                                        </span>
                                        <strong>
                                            {
                                                selectedConsultation.date
                                            }
                                        </strong>
                                    </div>

                                    <div className="consultation-detail-card">
                                        <span>
                                            Time
                                        </span>
                                        <strong>
                                            {
                                                selectedConsultation.time
                                            }
                                        </strong>
                                    </div>

                                    <div className="consultation-detail-card">
                                        <span>
                                            Status
                                        </span>
                                        <strong>
                                            {
                                                selectedConsultation.status
                                            }
                                        </strong>
                                    </div>

                                </div>

                                <div className="consultation-message-box">
                                    <span>
                                        Customer Message
                                    </span>

                                    <p>
                                        {
                                            selectedConsultation.message ||
                                            "No message provided."
                                        }
                                    </p>
                                </div>

                                <div className="consultation-status-update">

                                    <label>
                                        Update Status
                                    </label>

                                    <select
                                        value={
                                            selectedConsultation.status ||
                                            "Pending"
                                        }
                                        onChange={(e) =>
                                            updateStatus(
                                                selectedConsultation._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Confirmed">
                                            Confirmed
                                        </option>

                                        <option value="Completed">
                                            Completed
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>
                                    </select>

                                </div>

                            </div>

                            <div className="consultation-modal-footer">

                                <button
                                    type="button"
                                    className="consultation-modal-close-btn"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="consultation-modal-delete-btn"
                                    onClick={() =>
                                        deleteConsultation(
                                            selectedConsultation._id
                                        )
                                    }
                                >
                                    <Trash2 size={17} />
                                    Delete
                                </button>

                            </div>

                        </div>
                    </div>
                )}

        </AdminLayout>
    );
};

export default Consultations;