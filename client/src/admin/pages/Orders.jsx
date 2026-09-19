import { useEffect, useMemo, useState, Fragment } from "react";
import axios from "axios";

import {
    Eye,
    Trash2,
    Search,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    RefreshCw,
    Download,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../AdminLayout";
import "../css/Orders.css";

const API_URL = "http://localhost:5000";

const Orders = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const ordersPerPage = 5;

    // =====================================================
    // FETCH ORDERS
    // =====================================================

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError(
                    "Admin session expired. Please login again."
                );
                return;
            }

            const response = await axios.get(
                `${API_URL}/api/admin/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const receivedOrders = Array.isArray(
                response.data?.orders
            )
                ? response.data.orders
                : [];

            setOrders(receivedOrders);
        } catch (err) {
            console.error("FETCH ORDERS ERROR:", err);

            setOrders([]);

            setError(
                err.response?.data?.message ||
                    "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DELETE ORDER
    // =====================================================

    const deleteOrder = async (id) => {
        if (!id) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `${API_URL}/api/admin/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders((previousOrders) =>
                previousOrders.filter(
                    (order) => order._id !== id
                )
            );

            if (selectedOrder?._id === id) {
                setSelectedOrder(null);
                setShowModal(false);
            }

            toast.success(
                response.data?.message ||
                    "Order deleted successfully."
            );
        } catch (err) {
            console.error("DELETE ORDER ERROR:", err);

            toast.error(
                err.response?.data?.message ||
                    "Failed to delete order."
            );
        }
    };

    // =====================================================
    // VIEW ORDER
    // =====================================================

    const viewOrder = (order) => {
        if (!order) return;

        setSelectedOrder(order);
        setShowModal(true);
        setShowAdvancedStatus(false);
    };

    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    const updateStatus = async (id, newStatus) => {
        if (!id || !newStatus) return;

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                `${API_URL}/api/admin/orders/${id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedOrder = response.data?.order;

            if (updatedOrder) {
                setOrders((previousOrders) =>
                    previousOrders.map((order) =>
                        order._id === id
                            ? updatedOrder
                            : order
                    )
                );

                setSelectedOrder(updatedOrder);
            } else {
                setOrders((previousOrders) =>
                    previousOrders.map((order) =>
                        order._id === id
                            ? {
                                  ...order,
                                  status: newStatus,
                              }
                            : order
                    )
                );

                setSelectedOrder((previousOrder) =>
                    previousOrder
                        ? {
                              ...previousOrder,
                              status: newStatus,
                          }
                        : null
                );
            }

            toast.success(
                response.data?.message ||
                    "Order status updated."
            );
        } catch (err) {
            console.error(
                "UPDATE ORDER STATUS ERROR:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                    "Failed to update order status."
            );
        }
    };

    // =====================================================
    // SEARCH + FILTER + SORT
    // =====================================================

    const filteredOrders = useMemo(() => {
        return orders
            .filter((order) => {
                const orderNumber = String(
                    order?.orderNumber || ""
                ).toLowerCase();

                const userName = String(
                    order?.user?.name || ""
                ).toLowerCase();

                const userEmail = String(
                    order?.user?.email || ""
                ).toLowerCase();

                const searchText = search
                    .toLowerCase()
                    .trim();

                const matchesSearch =
                    orderNumber.includes(searchText) ||
                    userName.includes(searchText) ||
                    userEmail.includes(searchText);

                const matchesStatus =
                    statusFilter === "all" ||
                    order?.status === statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "newest":
                        return (
                            new Date(
                                b.createdAt || 0
                            ) -
                            new Date(
                                a.createdAt || 0
                            )
                        );

                    case "oldest":
                        return (
                            new Date(
                                a.createdAt || 0
                            ) -
                            new Date(
                                b.createdAt || 0
                            )
                        );

                    case "high":
                        return (
                            Number(
                                b.totalPrice || 0
                            ) -
                            Number(
                                a.totalPrice || 0
                            )
                        );

                    case "low":
                        return (
                            Number(
                                a.totalPrice || 0
                            ) -
                            Number(
                                b.totalPrice || 0
                            )
                        );

                    default:
                        return 0;
                }
            });
    }, [
        orders,
        search,
        statusFilter,
        sortBy,
    ]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredOrders.length /
                ordersPerPage
        )
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const indexOfLastOrder =
        safeCurrentPage * ordersPerPage;

    const indexOfFirstOrder =
        indexOfLastOrder - ordersPerPage;

    const currentOrders =
        filteredOrders.slice(
            indexOfFirstOrder,
            indexOfLastOrder
        );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, sortBy]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) =>
            order.status === "Pending"
    ).length;

    const processingOrders = orders.filter(
        (order) =>
            order.status === "Processing"
    ).length;

    const deliveredOrders = orders.filter(
        (order) =>
            order.status === "Delivered"
    ).length;

    const cancelledOrders = orders.filter(
        (order) =>
            order.status === "Cancelled"
    ).length;

    const totalRevenue = orders
        .filter(
            (order) =>
                order.status !== "Cancelled"
        )
        .reduce(
            (total, order) =>
                total +
                Number(order.totalPrice || 0),
            0
        );

    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (value) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(Number(value || 0));
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {
        if (!value) return "-";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // EXPORT ORDERS TO CSV
    // =====================================================

    const exportOrdersToCSV = () => {
        if (filteredOrders.length === 0) {
            toast.error("No orders available to export.");
            return;
        }

        const headers = [
            "Order Number",
            "Customer Name",
            "Customer Email",
            "Items",
            "Amount",
            "Payment Status",
            "Order Status",
            "Order Date",
        ];

        const rows = filteredOrders.map((order) => [
            order.orderNumber || "N/A",
            order.user?.name || "Guest User",
            order.user?.email || "-",
            order.totalItems || order.items?.length || 0,
            Number(order.totalPrice || 0),
            order.payment?.status || "Pending",
            order.status || "Pending",
            formatDate(order.createdAt),
        ]);

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) => {
                        const text = String(value ?? "");
                        return `"${text.replace(/"/g, '""')}"`;
                    })
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Modern-Interiors-Orders-${new Date()
            .toISOString()
            .split("T")[0]}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        toast.success("Orders exported successfully!");
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        return String(status || "Pending")
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    // =====================================================
    // ORDER TRACKING FLOW
    // =====================================================

    const trackerStages = [
        { key: "Pending", label: "Order Placed" },
        { key: "Confirmed", label: "Confirmed" },
        {
            key: "Out for Delivery",
            label: "Out for Delivery",
        },
        { key: "Delivered", label: "Delivered" },
    ];

    // Statuses no longer used going forward, but mapped
    // to the closest visible stage so older orders still
    // render a sensible tracker.
    const trackerStageIndex = (status) => {
        switch (status) {
            case "Pending":
                return 0;

            case "Confirmed":
            case "Processing":
                return 1;

            case "Shipped":
            case "Out for Delivery":
                return 2;

            case "Delivered":
                return 3;

            default:
                return 0;
        }
    };

    // Next status in the guided flow, based on where the
    // order currently sits.
    const nextStatusFor = (status) => {
        switch (status) {
            case "Pending":
                return "Confirmed";

            case "Confirmed":
            case "Processing":
                return "Out for Delivery";

            case "Shipped":
            case "Out for Delivery":
                return "Delivered";

            default:
                return null;
        }
    };

    const [showAdvancedStatus, setShowAdvancedStatus] =
        useState(false);


    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return (
                    <CheckCircle size={15} />
                );

            case "Shipped":
                return (
                    <Truck size={15} />
                );

            case "Out for Delivery":
                return (
                    <Truck size={15} />
                );

            case "Processing":
                return (
                    <Package size={15} />
                );

            case "Cancelled":
                return (
                    <XCircle size={15} />
                );

            default:
                return (
                    <Clock size={15} />
                );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

    return (
        <AdminLayout>

        <div className="products-page">

            <div className="products-loading-screen">

            <div className="products-loader"></div>

            <h2>
                Loading Orders...
            </h2>

            <p>
                Please wait while order data is loading.
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
                <div className="orders-error">
                    <XCircle size={45} />

                    <h2>{error}</h2>

                    <button
                        type="button"
                        onClick={fetchOrders}
                        className="retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            </AdminLayout>
        );
    }

    // =====================================================
    // MAIN JSX
    // =====================================================

    return (
        <AdminLayout>

            <div className="orders-page">

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="orders-header">

                    <div>
                        <h1>Orders</h1>

                        <p>
                            Manage and track all customer orders
                        </p>
                    </div>

                    <button
                        type="button"
                        className="refresh-orders-btn"
                        onClick={fetchOrders}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                </div>

{/* =================================================
    STATS
================================================= */}

<div className="orders-stats-grid">

    <div className="order-stat-card">

        <div className="order-stat-icon total">
            <Package size={22} />
        </div>

        <div>
            <p>Total Orders</p>
            <h3>{totalOrders}</h3>
        </div>

    </div>


    <div className="order-stat-card">

        <div className="order-stat-icon pending">
            <Clock size={22} />
        </div>

        <div>
            <p>Pending</p>
            <h3>{pendingOrders}</h3>
        </div>

    </div>


    <div className="order-stat-card">

        <div className="order-stat-icon processing">
            <Truck size={22} />
        </div>

        <div>
            <p>Processing</p>
            <h3>{processingOrders}</h3>
        </div>

    </div>


    <div className="order-stat-card">

        <div className="order-stat-icon delivered">
            <CheckCircle size={22} />
        </div>

        <div>
            <p>Delivered</p>
            <h3>{deliveredOrders}</h3>
        </div>

    </div>

</div>

                {/* =================================================
                    REVENUE
                ================================================== */}

                <div className="orders-revenue-card">

                    <div>
                        <span>Total Revenue</span>

                        <h2>
                            {formatCurrency(
                                totalRevenue
                            )}
                        </h2>
                    </div>

                    <div className="revenue-right">
                        <span>
                            Cancelled Orders
                        </span>

                        <strong>
                            {cancelledOrders}
                        </strong>
                    </div>

                </div>

                {/* =================================================
                    TOOLBAR
                ================================================== */}

                <div className="orders-toolbar">

                    {/* LEFT SIDE */}
                    <div className="orders-toolbar-left">
                    
<div className="orders-count">
    <h3>Total Orders : </h3>

    <span>
        {filteredOrders.length}
    </span>
</div>

                        <button
                            type="button"
                            className="export-btn"
                            onClick={exportOrdersToCSV}
                        >
                            <Download size={17} />
                            Export CSV
                        </button>

                    </div>


                    {/* RIGHT SIDE */}
                    <div className="orders-toolbar-right">

                        <div className="orders-search">

                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search order number, name or email..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="all">
                                All Status
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Confirmed">
                                Confirmed
                            </option>

                            <option value="Processing">
                                Processing
                            </option>

                            <option value="Shipped">
                                Shipped
                            </option>

                            <option value="Out for Delivery">
                                Out for Delivery
                            </option>

                            <option value="Delivered">
                                Delivered
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>
                        </select>


                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                        >
                            <option value="newest">
                                Newest First
                            </option>

                            <option value="oldest">
                                Oldest First
                            </option>

                            <option value="high">
                                Highest Amount
                            </option>

                            <option value="low">
                                Lowest Amount
                            </option>
                        </select>

                    </div>

                </div>

                {/* =================================================
                    TABLE
                ================================================== */}

                <div className="orders-table-container">

                    <table className="orders-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {currentOrders.length > 0 ? (
                                currentOrders.map(
                                    (order, index) => (
                                        <tr
                                            key={order._id}
                                        >

                                            <td>
                                                {indexOfFirstOrder +
                                                    index +
                                                    1}
                                            </td>


                                            <td>
                                                <div className="order-number">

                                                    <span className="order-icon">
                                                        <Package
                                                            size={17}
                                                        />
                                                    </span>

                                                    <div>

                                                        <strong>
                                                            {order.orderNumber ||
                                                                "N/A"}
                                                        </strong>

                                                        <small>
                                                            #
                                                            {order._id
                                                                ?.toString()
                                                                .slice(
                                                                    -6
                                                                )}
                                                        </small>

                                                    </div>

                                                </div>
                                            </td>


                                            <td>
                                                <div className="customer-info">

                                                    <div className="customer-avatar">
                                                        {(
                                                            order.user
                                                                ?.name ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {order.user
                                                                ?.name ||
                                                                "Guest User"}
                                                        </strong>

                                                        <small>
                                                            {order.user
                                                                ?.email ||
                                                                "-"}
                                                        </small>

                                                    </div>

                                                </div>
                                            </td>


                                            <td>
                                                <span className="items-count">
                                                    {order.totalItems ||
                                                        order.items
                                                            ?.length ||
                                                        0}
                                                </span>
                                            </td>


                                            <td>
                                                <strong className="order-price">
                                                    {formatCurrency(
                                                        order.totalPrice
                                                    )}
                                                </strong>
                                            </td>


                                            <td>
                                                <span
                                                    className={`payment-status ${
                                                        String(
                                                            order.payment
                                                                ?.status ||
                                                                "Pending"
                                                        )
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )
                                                    }`}
                                                >
                                                    {order.payment
                                                        ?.status ||
                                                        "Pending"}
                                                </span>
                                            </td>


                                            <td>
                                                <span
                                                    className={`order-status ${getStatusClass(
                                                        order.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        order.status
                                                    )}

                                                    {order.status ||
                                                        "Pending"}
                                                </span>
                                            </td>


                                            <td>
                                                <span className="order-date">
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </span>
                                            </td>


                                            <td>
                                                <div className="order-actions">

                                                    <button
                                                        type="button"
                                                        className="order-view-btn"
                                                        title="View Order"
                                                        onClick={() =>
                                                            viewOrder(
                                                                order
                                                            )
                                                        }
                                                    >
                                                        <Eye size={18} />
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="order-delete-btn"
                                                        title="Delete Order"
                                                        onClick={() =>
                                                            deleteOrder(
                                                                order._id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>

                                    <td
                                        colSpan="9"
                                        className="no-orders"
                                    >
                                        <Package size={50} />

                                        <h3>
                                            No Orders Found
                                        </h3>

                                        <p>
                                            No orders match your
                                            search or filter.
                                        </p>
                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                <div className="pagination">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    ‹
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                    type="button"
                    key={index}
                    className={
                        currentPage === index + 1
                        ? "active-page"
                        : ""
                    }
                    onClick={() => setCurrentPage(index + 1)}
                    >
                    {index + 1}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    ›
                </button>
                </div>
            
            </div>


            {/* =====================================================
                ORDER DETAILS MODAL
            ====================================================== */}

            {showModal && selectedOrder && (
                <div
                    className="order-modal-overlay"
                    onClick={() =>
                        setShowModal(false)
                    }
                >

                    <div
                        className="order-details-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="order-modal-header">

                            <div>

                                <span>
                                    ORDER DETAILS
                                </span>

                                <h2>
                                    {selectedOrder.orderNumber ||
                                        "Order"}
                                </h2>

                            </div>

                            <button
                                type="button"
                                className="order-modal-close"
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="order-modal-body">

                            {/* CUSTOMER */}

                            <div className="detail-section">

                                <h3>
                                    Customer Information
                                </h3>

                                <div className="customer-detail-card">

                                    <div className="customer-avatar large">

                                        {(
                                            selectedOrder
                                                .user
                                                ?.name ||
                                            "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    <div className="customer-detail-info">

                                        <h4>
                                            {selectedOrder
                                                .user
                                                ?.name ||
                                                "Guest User"}
                                        </h4>

                                        <p>
                                            {selectedOrder
                                                .user
                                                ?.email ||
                                                "-"}
                                        </p>

                                        <p>
                                            {selectedOrder
                                                .user
                                                ?.phone ||
                                                "-"}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* SHIPPING */}

                            <div className="detail-section">

                                <h3>
                                    Shipping Address
                                </h3>

                                <div className="shipping-card">

                                    <strong>
                                        {selectedOrder
                                            .shippingAddress
                                            ?.fullName ||
                                            selectedOrder
                                                .shippingAddress
                                                ?.name ||
                                            selectedOrder.user
                                                ?.name ||
                                            "Customer"}
                                    </strong>

                                    <p>
                                        {selectedOrder
                                            .shippingAddress
                                            ?.address ||
                                            selectedOrder.user
                                                ?.address ||
                                            "-"}
                                    </p>

                                    <p>
                                        {selectedOrder
                                            .shippingAddress
                                            ?.city ||
                                            selectedOrder.user
                                                ?.city ||
                                            "-"}
                                        {", "}
                                        {selectedOrder
                                            .shippingAddress
                                            ?.state ||
                                            selectedOrder.user
                                                ?.state ||
                                            "-"}
                                    </p>

                                    <p>
                                        Pincode:{" "}
                                        {selectedOrder
                                            .shippingAddress
                                            ?.pincode ||
                                            selectedOrder.user
                                                ?.pincode ||
                                            "-"}
                                    </p>

                                    <p>
                                        Phone:{" "}
                                        {selectedOrder
                                            .shippingAddress
                                            ?.phone ||
                                            selectedOrder.user
                                                ?.phone ||
                                            "-"}
                                    </p>

                                </div>

                            </div>


                            {/* ORDER ITEMS */}

                            <div className="detail-section">

                                <h3>
                                    Ordered Items
                                </h3>

                                <div className="order-items-list">

                                    {Array.isArray(
                                        selectedOrder.items
                                    ) &&
                                    selectedOrder.items
                                        .length > 0 ? (
                                        selectedOrder.items.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    className="order-item-card"
                                                    key={
                                                        item._id ||
                                                        index
                                                    }
                                                >

                                                    <div>

                                                        <strong>
                                                            {item.furniture
                                                                ?.name ||
                                                                "Product"}
                                                        </strong>

                                                        <p>
                                                            Quantity:{" "}
                                                            {item.quantity ||
                                                                0}
                                                        </p>

                                                    </div>

                                                    <strong>
                                                        {formatCurrency(
                                                            Number(
                                                                item.price ||
                                                                    0
                                                            ) *
                                                                Number(
                                                                    item.quantity ||
                                                                        0
                                                                )
                                                        )}
                                                    </strong>

                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p>
                                            No item details available.
                                        </p>
                                    )}

                                </div>

                            </div>


                            {/* ORDER SUMMARY */}

                            <div className="detail-section">

                                <h3>
                                    Order Summary
                                </h3>

                                <div className="summary-grid">

                                    <div>
                                        <span>
                                            Order Date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                selectedOrder.createdAt
                                            )}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Total Items
                                        </span>

                                        <strong>
                                            {selectedOrder.totalItems ||
                                                selectedOrder
                                                    .items
                                                    ?.length ||
                                                0}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Payment
                                        </span>

                                        <strong>
                                            {selectedOrder
                                                .payment
                                                ?.status ||
                                                "Pending"}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Order Status
                                        </span>

                                        <strong>
                                            {selectedOrder.status ||
                                                "Pending"}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            {/* PAYMENT SUMMARY */}

                            <div className="detail-section">

                                <h3>
                                    Payment Summary
                                </h3>

                                <div className="price-summary">

                                    <div>
                                        <span>
                                            Subtotal
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                selectedOrder.subtotal
                                            )}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Delivery Charge
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                selectedOrder.deliveryCharge
                                            )}
                                        </strong>
                                    </div>


                                    <div className="grand-total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                selectedOrder.totalPrice
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* ORDER TRACKING */}

                            <div className="detail-section">

                                <h3>
                                    Order Tracking
                                </h3>

                                {selectedOrder.status ===
                                "Cancelled" ? (

                                    <div className="order-tracker-cancelled">
                                        <XCircle size={18} />
                                        This order has been
                                        cancelled.
                                    </div>

                                ) : (

                                    <div className="order-tracker">

                                        {trackerStages.map(
                                            (
                                                stage,
                                                index
                                            ) => {

                                                const currentIndex =
                                                    trackerStageIndex(
                                                        selectedOrder.status
                                                    );

                                                const isDone =
                                                    index <
                                                    currentIndex;

                                                const isCurrent =
                                                    index ===
                                                    currentIndex;

                                                return (
                                                    <Fragment
                                                        key={
                                                            stage.key
                                                        }
                                                    >

                                                        <div
                                                            className={
                                                                `order-tracker-step ${
                                                                    isDone
                                                                        ? "done"
                                                                        : ""
                                                                } ${
                                                                    isCurrent
                                                                        ? "current"
                                                                        : ""
                                                                }`
                                                            }
                                                        >

                                                            <div className="order-tracker-dot">
                                                                {isDone ||
                                                                isCurrent
                                                                    ? "✓"
                                                                    : index +
                                                                      1}
                                                            </div>

                                                            <span className="order-tracker-label">
                                                                {
                                                                    stage.label
                                                                }
                                                            </span>

                                                        </div>


                                                        {index <
                                                            trackerStages.length -
                                                                1 && (

                                                            <div
                                                                className={
                                                                    `order-tracker-line ${
                                                                        index <
                                                                        currentIndex
                                                                            ? "done"
                                                                            : ""
                                                                    }`
                                                                }
                                                            />

                                                        )}

                                                    </Fragment>
                                                );

                                            }
                                        )}

                                    </div>

                                )}


                                {/* PRIMARY ACTIONS */}

                                {selectedOrder.status ===
                                    "Delivered" && (

                                    <div className="order-final-note">
                                        <CheckCircle size={18} />
                                        Delivered on{" "}
                                        {formatDate(
                                            selectedOrder.deliveredAt
                                        )}
                                    </div>

                                )}

                                {selectedOrder.status !==
                                    "Delivered" &&
                                    selectedOrder.status !==
                                        "Cancelled" && (

                                    <div className="status-action-row">

                                        {nextStatusFor(
                                            selectedOrder.status
                                        ) && (

                                            <button
                                                type="button"
                                                className="status-action-btn primary"
                                                onClick={() =>
                                                    updateStatus(
                                                        selectedOrder._id,
                                                        nextStatusFor(
                                                            selectedOrder.status
                                                        )
                                                    )
                                                }
                                            >
                                                <CheckCircle size={16} />
                                                Mark as{" "}
                                                {nextStatusFor(
                                                    selectedOrder.status
                                                )}
                                            </button>

                                        )}


                                        <button
                                            type="button"
                                            className="status-action-btn danger"
                                            onClick={() => {

                                                if (
                                                    window.confirm(
                                                        "Cancel this order?"
                                                    )
                                                ) {

                                                    updateStatus(
                                                        selectedOrder._id,
                                                        "Cancelled"
                                                    );

                                                }

                                            }}
                                        >
                                            <XCircle size={16} />
                                            Cancel Order
                                        </button>

                                    </div>

                                )}


                                {/* ADVANCED OVERRIDE */}

                                <button
                                    type="button"
                                    className="status-advanced-toggle"
                                    onClick={() =>
                                        setShowAdvancedStatus(
                                            (value) => !value
                                        )
                                    }
                                >
                                    {showAdvancedStatus
                                        ? "Hide advanced status options"
                                        : "Set a custom status manually"}
                                </button>


                                {showAdvancedStatus && (

                                    <div className="status-update-box">

                                        <select
                                            value={
                                                selectedOrder.status ||
                                                "Pending"
                                            }
                                            onChange={(e) =>
                                                updateStatus(
                                                    selectedOrder._id,
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

                                            <option value="Processing">
                                                Processing
                                            </option>

                                            <option value="Shipped">
                                                Shipped
                                            </option>

                                            <option value="Out for Delivery">
                                                Out for Delivery
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>

                                        </select>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* MODAL FOOTER */}

                        <div className="order-modal-footer">

                            <button
                                type="button"
                                className="modal-cancel-btn"
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                            >
                                Close
                            </button>


                            <button
                                type="button"
                                className="modal-delete-btn"
                                onClick={() =>
                                    deleteOrder(
                                        selectedOrder._id
                                    )
                                }
                            >
                                <Trash2 size={17} />
                                Delete Order
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </AdminLayout>
    );
};

export default Orders;