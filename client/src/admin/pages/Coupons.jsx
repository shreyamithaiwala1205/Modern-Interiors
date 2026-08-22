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
} from "lucide-react";

import { toast } from "react-toastify";

import AdminLayout from "../AdminLayout";
import "../css/Coupons.css";

const API =
    "http://localhost:5000/api/admin/coupons";

const emptyForm = {
    code: "",
    discount: "",
    minAmount: "",
    active: true,
};

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [modal, setModal] =
        useState(null);

    const [selectedCoupon, setSelectedCoupon] =
        useState(null);

    const [formData, setFormData] =
        useState(emptyForm);

    // =====================================================
    // FETCH
    // =====================================================

    const fetchCoupons = async () => {
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

            setCoupons(
                response.data?.coupons ||
                []
            );
        } catch (error) {
            console.error(
                "FETCH COUPONS:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
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
    // FILTER
    // =====================================================

    const filteredCoupons =
        useMemo(() => {
            const text =
                search
                    .trim()
                    .toLowerCase();

            return coupons.filter(
                (coupon) => {
                    const matchSearch =
                        String(
                            coupon.code ||
                                ""
                        )
                            .toLowerCase()
                            .includes(text);

                    const matchStatus =
                        statusFilter ===
                        "all"
                            ? true
                            : statusFilter ===
                              "active"
                            ? coupon.active
                            : !coupon.active;

                    return (
                        matchSearch &&
                        matchStatus
                    );
                }
            );
        }, [
            coupons,
            search,
            statusFilter,
        ]);

    // =====================================================
    // STATS
    // =====================================================

    const total =
        coupons.length;

    const active =
        coupons.filter(
            (coupon) =>
                coupon.active
        ).length;

    const inactive =
        coupons.filter(
            (coupon) =>
                !coupon.active
        ).length;

    // =====================================================
    // OPEN ADD
    // =====================================================

    const openAdd = () => {
        setSelectedCoupon(null);

        setFormData({
            ...emptyForm,
        });

        setModal("add");
    };

    // =====================================================
    // OPEN VIEW
    // =====================================================

    const openView = (coupon) => {
        setSelectedCoupon(coupon);
        setModal("view");
    };

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEdit = (coupon) => {
        setSelectedCoupon(coupon);

        setFormData({
            code:
                coupon.code || "",

            discount:
                coupon.discount ?? "",

            minAmount:
                coupon.minAmount ?? "",

            active:
                coupon.active ?? true,
        });

        setModal("edit");
    };

    // =====================================================
    // CLOSE
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

        setFormData(
            (previous) => ({
                ...previous,
                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );
    };

    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const saveCoupon = async (e) => {
        e.preventDefault();

        const code =
            String(
                formData.code || ""
            )
                .trim()
                .toUpperCase();

        const discount =
            Number(
                formData.discount
            );

        const minAmount =
            Number(
                formData.minAmount || 0
            );

        if (!code) {
            toast.error(
                "Enter coupon code"
            );
            return;
        }

        if (
            !Number.isFinite(
                discount
            ) ||
            discount < 1 ||
            discount > 100
        ) {
            toast.error(
                "Discount must be between 1 and 100"
            );
            return;
        }

        if (
            !Number.isFinite(
                minAmount
            ) ||
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
                localStorage.getItem(
                    "token"
                );

            const data = {
                code,
                discount,
                minAmount,
                active:
                    Boolean(
                        formData.active
                    ),
            };

            let response;

            if (
                modal === "edit" &&
                selectedCoupon?._id
            ) {
                response =
                    await axios.put(
                        `${API}/${selectedCoupon._id}`,
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
                "Coupon saved successfully"
            );

            closeModal();

            await fetchCoupons();
        } catch (error) {
            console.error(
                "SAVE COUPON ERROR:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                "Failed to save coupon"
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deleteCoupon =
        async (coupon) => {
            const yes =
                window.confirm(
                    `Delete coupon ${coupon.code}?`
                );

            if (!yes) return;

            try {
                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await axios.delete(
                        `${API}/${coupon._id}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                toast.success(
                    response.data
                        ?.message ||
                    "Coupon deleted successfully"
                );

                setCoupons(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                item._id !==
                                coupon._id
                        )
                );
            } catch (error) {
                console.error(
                    "DELETE COUPON ERROR:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                    "Failed to delete coupon"
                );
            }
        };

    // =====================================================
    // TOGGLE
    // =====================================================

    const toggleCoupon =
        async (coupon) => {
            try {
                const token =
                    localStorage.getItem(
                        "token"
                    );

                const newStatus =
                    !coupon.active;

                const response =
                    await axios.put(
                        `${API}/${coupon._id}`,
                        {
                            active:
                                newStatus,
                        },
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                toast.success(
                    newStatus
                        ? "Coupon activated"
                        : "Coupon deactivated"
                );

                setCoupons(
                    (previous) =>
                        previous.map(
                            (item) =>
                                item._id ===
                                coupon._id
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
                    error.response?.data
                        ?.message ||
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
                <div className="coupons-loading">
                    Loading Coupons...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="coupons-page">

                {/* HEADER */}

                <div className="coupons-header">

                    <div>
                        <h1>Coupons</h1>

                        <p>
                            Manage discount coupons for your customers.
                        </p>
                    </div>

                    <button
                        className="add-coupon-btn"
                        onClick={
                            openAdd
                        }
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

                    <div className="coupon-search">
                        <Search
                            size={18}
                        />

                        <input
                            value={
                                search
                            }
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search coupon code..."
                        />
                    </div>

                    <select
                        value={
                            statusFilter
                        }
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

                {/* TABLE */}

                <div className="coupons-table-container">

                    <table className="coupons-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Minimum Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredCoupons.map(
                                (
                                    coupon,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            coupon._id
                                        }
                                    >

                                        <td>
                                            {index + 1}
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
                                                {
                                                    coupon.active
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <div className="coupon-actions">

                                                <button
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

                                                <button
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

                                                {/* TOGGLE SWITCH */}

                                                <button
                                                    type="button"
                                                    className={`coupon-toggle-switch ${
                                                        coupon.active ? "on" : ""
                                                    }`}
                                                    onClick={() =>
                                                        toggleCoupon(coupon)
                                                    }
                                                    title={
                                                        coupon.active
                                                            ? "Deactivate coupon"
                                                            : "Activate coupon"
                                                    }
                                                >
                                                    <span className="toggle-circle" />
                                                </button>

                                                <button
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
            </div>

            {/* =====================================================
                MODAL
            ====================================================== */}

            {modal && (
                <div
                    className="coupon-modal-overlay"
                    onClick={
                        closeModal
                    }
                >
                    <div
                        className="coupon-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

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
                                className="coupon-close-btn"
                                onClick={
                                    closeModal
                                }
                            >
                                <X
                                    size={20}
                                />
                            </button>

                        </div>

                        {/* VIEW */}

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
                                        {
                                            selectedCoupon?.active
                                                ? "Active"
                                                : "Inactive"
                                        }
                                    </strong>
                                </div>

                            </div>
                        )}

                        {/* ADD / EDIT */}

                        {(modal ===
                            "add" ||
                            modal ===
                                "edit") && (
                            <form
                                className="coupon-form"
                                onSubmit={
                                    saveCoupon
                                }
                            >

                                <div className="coupon-form-group">

                                    <label>
                                        Coupon Code
                                    </label>

                                    <input
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

                                {/* OPTIONAL ACTIVE CHECKBOX */}

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

                                <div className="coupon-modal-actions">

                                    <button
                                        type="button"
                                        className="coupon-cancel-btn"
                                        onClick={
                                            closeModal
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
        </AdminLayout>
    );
};

export default Coupons;