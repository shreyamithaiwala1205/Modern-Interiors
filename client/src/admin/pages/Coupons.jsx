import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    X,
    Tag,
    CheckCircle,
    XCircle,
    Download,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../AdminLayout";
import "../css/Coupons.css";

const API = "http://localhost:5000/api/admin/coupons";

const emptyForm = {
    code: "",
    discount: "",
    minAmount: "",
    active: true,
};

const Coupons = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [modal, setModal] = useState(null);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const [formData, setFormData] = useState({
        ...emptyForm,
    });

    // =====================================================
    // FETCH COUPONS
    // =====================================================

    const fetchCoupons = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.get(API, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCoupons(response.data?.coupons || []);
        } catch (error) {
            console.error("FETCH COUPONS:", error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch coupons"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // =====================================================
    // FILTER COUPONS
    // =====================================================

    const filteredCoupons = useMemo(() => {
        const text = search.trim().toLowerCase();

        return coupons.filter((coupon) => {
            const matchSearch = String(coupon.code || "")
                .toLowerCase()
                .includes(text);

            const matchStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                    ? coupon.active
                    : !coupon.active;

            return matchSearch && matchStatus;
        });
    }, [coupons, search, statusFilter]);

// =====================================================
// PAGINATION
// =====================================================

const totalPages = Math.ceil(
    filteredCoupons.length / itemsPerPage
);

const paginatedCoupons = useMemo(() => {
    const startIndex =
        (currentPage - 1) * itemsPerPage;

    return filteredCoupons.slice(
        startIndex,
        startIndex + itemsPerPage
    );
}, [
    filteredCoupons,
    currentPage,
    itemsPerPage,
]);

// Search / filter change → first page
useEffect(() => {
    setCurrentPage(1);
}, [search, statusFilter]);

// Keep current page valid after delete/filter
useEffect(() => {
    if (
        totalPages > 0 &&
        currentPage > totalPages
    ) {
        setCurrentPage(totalPages);
    }
}, [currentPage, totalPages]);

const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
        return;
    }

    setCurrentPage(page);
};
    // =====================================================
    // STATS
    // =====================================================

    const total = coupons.length;

    const active = coupons.filter(
        (coupon) => coupon.active
    ).length;

    const inactive = coupons.filter(
        (coupon) => !coupon.active
    ).length;

    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAdd = () => {
        setSelectedCoupon(null);

        setFormData({
            ...emptyForm,
        });

        setModal("add");
    };

    // =====================================================
    // OPEN VIEW MODAL
    // =====================================================

    const openView = (coupon) => {
        setSelectedCoupon(coupon);
        setModal("view");
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEdit = (coupon) => {
        setSelectedCoupon(coupon);

        setFormData({
            code: coupon.code || "",
            discount: coupon.discount ?? "",
            minAmount: coupon.minAmount ?? "",
            active: coupon.active ?? true,
        });

        setModal("edit");
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (saving) return;

        setModal(null);
        setSelectedCoupon(null);

        setFormData({
            ...emptyForm,
        });
    };

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            checked,
            type,
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // =====================================================
    // CREATE / UPDATE COUPON
    // =====================================================

    const saveCoupon = async (e) => {
        e.preventDefault();

        const code = String(formData.code || "")
            .trim()
            .toUpperCase();

        const discount = Number(
            formData.discount
        );

        const minAmount = Number(
            formData.minAmount || 0
        );

        // Validation
        if (!code) {
            toast.error("Enter coupon code");
            return;
        }

        if (
            !Number.isFinite(discount) ||
            discount < 1 ||
            discount > 100
        ) {
            toast.error(
                "Discount must be between 1 and 100"
            );
            return;
        }

        if (
            !Number.isFinite(minAmount) ||
            minAmount < 0
        ) {
            toast.error(
                "Enter valid minimum amount"
            );
            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem("token");

            const data = {
                code,
                discount,
                minAmount,
                active: Boolean(
                    formData.active
                ),
            };

            let response;

            // UPDATE
            if (
                modal === "edit" &&
                selectedCoupon?._id
            ) {
                response = await axios.put(
                    `${API}/${selectedCoupon._id}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // CREATE
            else {
                response = await axios.post(
                    API,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            toast.success(
                response.data?.message ||
                    "Coupon saved successfully"
            );

            // Close without blocking because saving
            setModal(null);
            setSelectedCoupon(null);

            setFormData({
                ...emptyForm,
            });

            await fetchCoupons();
        } catch (error) {
            console.error(
                "SAVE COUPON ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to save coupon"
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // EXPORT CSV
    // =====================================================

    const exportCouponsCSV = () => {
        if (coupons.length === 0) {
            toast.error(
                "No coupons available to export"
            );
            return;
        }

        const headers = [
            "No.",
            "Coupon Code",
            "Discount (%)",
            "Minimum Order",
            "Status",
        ];

        const rows = coupons.map(
            (coupon, index) => [
                index + 1,
                coupon.code || "",
                coupon.discount ?? "",
                coupon.minAmount ?? 0,
                coupon.active
                    ? "Active"
                    : "Inactive",
            ]
        );

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value).replace(
                                /"/g,
                                '""'
                            )}"`
                    )
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = "coupons.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success(
            "Coupons exported successfully"
        );
    };

    // =====================================================
    // DELETE COUPON
    // =====================================================

    const deleteCoupon = async (coupon) => {
        const yes = window.confirm(
            `Delete coupon ${coupon.code}?`
        );

        if (!yes) return;

        try {
            const token =
                localStorage.getItem("token");

            const response =
                await axios.delete(
                    `${API}/${coupon._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            toast.success(
                response.data?.message ||
                    "Coupon deleted successfully"
            );

            setCoupons((previous) =>
                previous.filter(
                    (item) =>
                        item._id !== coupon._id
                )
            );
        } catch (error) {
            console.error(
                "DELETE COUPON ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to delete coupon"
            );
        }
    };

    // =====================================================
    // TOGGLE COUPON STATUS
    // =====================================================

    const toggleCoupon = async (coupon) => {
        try {
            const token =
                localStorage.getItem("token");

            const newStatus =
                !coupon.active;

            await axios.put(
                `${API}/${coupon._id}`,
                {
                    active: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                newStatus
                    ? "Coupon activated"
                    : "Coupon deactivated"
            );

            setCoupons((previous) =>
                previous.map((item) =>
                    item._id === coupon._id
                        ? {
                              ...item,
                              active:
                                  newStatus,
                          }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "TOGGLE COUPON ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to change coupon status"
            );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <AdminLayout>
                <div className="coupons-page">
                    <div className="coupons-loading-screen">
                        <div className="coupons-loader"></div>

                        <h2>
                            Loading Coupons...
                        </h2>

                        <p>
                            Please wait while coupon
                            data is loading.
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <AdminLayout>
            <div className="coupons-page">

                {/* HEADER */}

                <div className="coupons-header">

                    <div>
                        <h1>Coupons</h1>

                        <p>
                            Manage discount coupons
                            for your customers.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-coupon-btn"
                        onClick={openAdd}
                    >
                        <Plus size={18} />
                        Add Coupon
                    </button>

                </div>

                {/* STATS */}

                <div className="coupons-stats">

                    <div className="coupon-stat-card">

                        <Tag size={25} />

                        <div>
                            <span>
                                Total Coupons
                            </span>

                            <strong>
                                {total}
                            </strong>
                        </div>

                    </div>

                    <div className="coupon-stat-card active">

                        <CheckCircle
                            size={25}
                        />

                        <div>
                            <span>
                                Active
                            </span>

                            <strong>
                                {active}
                            </strong>
                        </div>

                    </div>

                    <div className="coupon-stat-card inactive">

                        <XCircle
                            size={25}
                        />

                        <div>
                            <span>
                                Inactive
                            </span>

                            <strong>
                                {inactive}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* TOOLBAR */}

                <div className="coupons-toolbar">

                    {/* LEFT */}

                    <div className="coupons-toolbar-left">

                        <span className="total-coupons-text">
                            Total Coupons:{" "}
                            <strong>
                                {total}
                            </strong>
                        </span>

                        <button
                            type="button"
                            className="export-coupons-btn"
                            onClick={
                                exportCouponsCSV
                            }
                        >
                            <Download size={16} />
                            Export CSV
                        </button>

                    </div>

                    {/* RIGHT */}

                    <div className="coupons-toolbar-right">

                        <div className="coupon-search">

                            <Search size={18} />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search coupon code..."
                            />

                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="all">
                                All Coupons
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>

                    </div>

                </div>

                {/* TABLE */}

                <div className="coupons-table-container">

                    <table className="coupons-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>
                                    Minimum Order
                                </th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {paginatedCoupons.map(
                                (coupon, index) => (
                                    <tr
                                        key={
                                            coupon._id
                                        }
                                    >

                                        <td>
                                            {(currentPage -
                                                1) *
                                                itemsPerPage +
                                                index +
                                                1}
                                        </td>

                                        <td>
                                            <strong className="coupon-code">
                                                {
                                                    coupon.code
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {
                                                coupon.discount
                                            }
                                            %
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                coupon.minAmount ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>

                                        <td>
                                            <span
                                                className={`coupon-status ${
                                                    coupon.active
                                                        ? "active"
                                                        : "inactive"
                                                }`}
                                            >
                                                {coupon.active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td>

                                            <div className="coupon-actions">

                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    className="coupon-view-btn"
                                                    onClick={() =>
                                                        openView(
                                                            coupon
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

                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    className="coupon-edit-btn"
                                                    onClick={() =>
                                                        openEdit(
                                                            coupon
                                                        )
                                                    }
                                                    title="Edit"
                                                >
                                                    <Edit
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                                {/* TOGGLE */}

                                                <button
                                                    type="button"
                                                    className={`coupon-toggle-switch ${
                                                        coupon.active
                                                            ? "on"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        toggleCoupon(
                                                            coupon
                                                        )
                                                    }
                                                    title={
                                                        coupon.active
                                                            ? "Deactivate coupon"
                                                            : "Activate coupon"
                                                    }
                                                >
                                                    <span className="toggle-circle" />
                                                </button>

                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    className="coupon-delete-btn"
                                                    onClick={() =>
                                                        deleteCoupon(
                                                            coupon
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
                            )}

                            {filteredCoupons.length ===
                                0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="no-coupons"
                                    >
                                        No coupons found
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                {filteredCoupons.length > 0 &&
                    totalPages > 1 && (
                        <div className="coupons-pagination">

                            {/* PREVIOUS */}

                            <button
                                type="button"
                                className="coupon-page-btn"
                                disabled={
                                    currentPage ===
                                    1
                                }
                                onClick={() =>
                                    goToPage(
                                        currentPage - 1
                                    )
                                }
                            >
                                <ChevronLeft
                                    size={17}
                                />
                            </button>

                            {/* PAGE NUMBERS */}

                            <div className="coupon-page-numbers">

                                {totalPages <= 5 ? (
                                    Array.from(
                                        {
                                            length:
                                                totalPages,
                                        },
                                        (
                                            _,
                                            index
                                        ) =>
                                            index + 1
                                    ).map(
                                        (
                                            page
                                        ) => (
                                            <button
                                                key={
                                                    page
                                                }
                                                type="button"
                                                className={`coupon-page-number ${
                                                    currentPage ===
                                                    page
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    goToPage(
                                                        page
                                                    )
                                                }
                                            >
                                                {
                                                    page
                                                }
                                            </button>
                                        )
                                    )
                                ) : (
                                    <>
                                        {/* FIRST PAGE */}

                                        <button
                                            type="button"
                                            className={`coupon-page-number ${
                                                currentPage ===
                                                1
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                goToPage(
                                                    1
                                                )
                                            }
                                        >
                                            1
                                        </button>

                                        {/* LEFT DOTS */}

                                        {currentPage >
                                            3 && (
                                            <span className="coupon-pagination-dots">
                                                ...
                                            </span>
                                        )}

                                        {/* MIDDLE PAGES */}

                                        {Array.from(
                                            {
                                                length: 3,
                                            },
                                            (
                                                _,
                                                index
                                            ) =>
                                                currentPage -
                                                1 +
                                                index
                                        )
                                            .filter(
                                                (
                                                    page
                                                ) =>
                                                    page >
                                                        1 &&
                                                    page <
                                                        totalPages
                                            )
                                            .map(
                                                (
                                                    page
                                                ) => (
                                                    <button
                                                        key={
                                                            page
                                                        }
                                                        type="button"
                                                        className={`coupon-page-number ${
                                                            currentPage ===
                                                            page
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            goToPage(
                                                                page
                                                            )
                                                        }
                                                    >
                                                        {
                                                            page
                                                        }
                                                    </button>
                                                )
                                            )}

                                        {/* RIGHT DOTS */}

                                        {currentPage <
                                            totalPages -
                                                2 && (
                                            <span className="coupon-pagination-dots">
                                                ...
                                            </span>
                                        )}

                                        {/* LAST PAGE */}

                                        <button
                                            type="button"
                                            className={`coupon-page-number ${
                                                currentPage ===
                                                totalPages
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                goToPage(
                                                    totalPages
                                                )
                                            }
                                        >
                                            {
                                                totalPages
                                            }
                                        </button>
                                    </>
                                )}

                            </div>

                            {/* NEXT */}

                            <button
                                type="button"
                                className="coupon-page-btn"
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    goToPage(
                                        currentPage + 1
                                    )
                                }
                            >
                                <ChevronRight
                                    size={17}
                                />
                            </button>

                        </div>
                    )}

                {/* =====================================================
                    MODAL
                ===================================================== */}

                {modal && (
                    <div
                        className="coupon-modal-overlay"
                        onClick={closeModal}
                    >

                        <div
                            className="coupon-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            {/* MODAL HEADER */}

                            <div className="coupon-modal-header">

                                <div>
                                    <h2>
                                        {modal ===
                                        "add"
                                            ? "Add Coupon"
                                            : modal ===
                                              "edit"
                                            ? "Edit Coupon"
                                            : "Coupon Details"}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="coupon-close-btn"
                                    onClick={
                                        closeModal
                                    }
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            {/* VIEW MODAL */}

                            {modal ===
                                "view" && (
                                <div className="coupon-view-body">

                                    <div className="coupon-view-card">
                                        <span>
                                            Coupon Code
                                        </span>

                                        <strong>
                                            {
                                                selectedCoupon?.code
                                            }
                                        </strong>
                                    </div>

                                    <div className="coupon-view-card">
                                        <span>
                                            Discount
                                        </span>

                                        <strong>
                                            {
                                                selectedCoupon?.discount
                                            }
                                            %
                                        </strong>
                                    </div>

                                    <div className="coupon-view-card">
                                        <span>
                                            Minimum Order
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                selectedCoupon?.minAmount ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>

                                    <div className="coupon-view-card">
                                        <span>
                                            Status
                                        </span>

                                        <strong>
                                            {selectedCoupon?.active
                                                ? "Active"
                                                : "Inactive"}
                                        </strong>
                                    </div>

                                </div>
                            )}

                            {/* ADD / EDIT MODAL */}

                            {(modal === "add" ||
                                modal === "edit") && (
                                <form
                                    className="coupon-form"
                                    onSubmit={
                                        saveCoupon
                                    }
                                >

                                    {/* COUPON CODE */}

                                    <div className="coupon-form-group">

                                        <label>
                                            Coupon Code
                                        </label>

                                        <input
                                            type="text"
                                            name="code"
                                            value={
                                                formData.code
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="SAVE10"
                                        />

                                    </div>

                                    {/* DISCOUNT */}

                                    <div className="coupon-form-group">

                                        <label>
                                            Discount (%)
                                        </label>

                                        <input
                                            type="number"
                                            name="discount"
                                            value={
                                                formData.discount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="1"
                                            max="100"
                                            placeholder="10"
                                        />

                                    </div>

                                    {/* MINIMUM ORDER */}

                                    <div className="coupon-form-group">

                                        <label>
                                            Minimum Order Amount
                                        </label>

                                        <input
                                            type="number"
                                            name="minAmount"
                                            value={
                                                formData.minAmount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="0"
                                            placeholder="1000"
                                        />

                                    </div>

                                    {/* ACTIVE */}

                                    <label className="coupon-checkbox-row">

                                        <input
                                            type="checkbox"
                                            name="active"
                                            checked={
                                                formData.active
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span>
                                            Active
                                        </span>

                                    </label>

                                    {/* ACTIONS */}

                                    <div className="coupon-modal-actions">

                                        <button
                                            type="button"
                                            className="coupon-cancel-btn"
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
                                            className="coupon-save-btn"
                                            disabled={
                                                saving
                                            }
                                        >
                                            {saving
                                                ? "Saving..."
                                                : modal ===
                                                  "edit"
                                                ? "Update Coupon"
                                                : "Create Coupon"}
                                        </button>

                                    </div>

                                </form>
                            )}

                        </div>

                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default Coupons;

