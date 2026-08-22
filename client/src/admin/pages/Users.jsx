import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import {
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

import AdminLayout from "../AdminLayout";
import "../css/Users.css";

const API_URL = "http://localhost:5000";

const Users = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] = useState("all");

    const [sortBy, setSortBy] = useState("newest");

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedUser, setSelectedUser] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [editUser, setEditUser] = useState({
        _id: "",
        name: "",
        phone: "",
        city: "",
        state: "",
        pincode: "",
        address: "",
        role: "user",
    });

    const usersPerPage = 5;

    // =====================================================
    // FETCH USERS
    // =====================================================

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Admin session expired. Please login again.");
                return;
            }

            const response = await axios.get(
                `${API_URL}/api/admin/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const receivedUsers = Array.isArray(
                response.data?.users
            )
                ? response.data.users
                : [];

            // Remove null / invalid users
            const validUsers = receivedUsers.filter(
                (user) =>
                    user &&
                    typeof user === "object" &&
                    user._id
            );

            setUsers(validUsers);
        } catch (err) {
            console.error("GET USERS ERROR:", err);

            setUsers([]);

            setError(
                err.response?.data?.message ||
                "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DELETE USER
    // =====================================================

    const deleteUser = async (id) => {
        if (!id) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `${API_URL}/api/admin/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (user) => user._id !== id
                )
            );

            if (selectedUser?._id === id) {
                setSelectedUser(null);
                setShowViewModal(false);
                setShowEditModal(false);
            }

            toast.success(
                response.data?.message ||
                "User deleted successfully."
            );
        } catch (err) {
            console.error("DELETE USER ERROR:", err);

            toast.error(
                err.response?.data?.message ||
                "Failed to delete user."
            );
        }
    };

    // =====================================================
    // FILTER + SEARCH + SORT
    // =====================================================

    const filteredUsers = users
        .filter((user) => {
            const name =
                user?.name?.toLowerCase() || "";

            const email =
                user?.email?.toLowerCase() || "";

            const searchValue =
                search.toLowerCase().trim();

            const matchesSearch =
                name.includes(searchValue) ||
                email.includes(searchValue);

            const matchesRole =
                roleFilter === "all" ||
                user?.role === roleFilter;

            return (
                matchesSearch &&
                matchesRole
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return (
                        new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0)
                    );

                case "oldest":
                    return (
                        new Date(a.createdAt || 0) -
                        new Date(b.createdAt || 0)
                    );

                case "az":
                    return (
                        a?.name || ""
                    ).localeCompare(
                        b?.name || ""
                    );

                case "za":
                    return (
                        b?.name || ""
                    ).localeCompare(
                        a?.name || ""
                    );

                default:
                    return 0;
            }
        });

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredUsers.length /
                usersPerPage
            )
        );

    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        );

    const indexOfLastUser =
        safeCurrentPage * usersPerPage;

    const indexOfFirstUser =
        indexOfLastUser - usersPerPage;

    const currentUsers =
        filteredUsers.slice(
            indexOfFirstUser,
            indexOfLastUser
        );

    // =====================================================
    // RESET PAGE WHEN FILTER CHANGES
    // =====================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter, sortBy]);

    // =====================================================
    // STATS
    // =====================================================

    const totalUsers = users.length;

    const totalAdmins = users.filter(
        (user) =>
            user?.role === "admin"
    ).length;

    const totalCustomers = users.filter(
        (user) =>
            user?.role === "user"
    ).length;

    const newUsersThisMonth =
        users.filter((user) => {
            if (!user?.createdAt) return false;

            const created =
                new Date(user.createdAt);

            const today =
                new Date();

            return (
                created.getMonth() ===
                    today.getMonth() &&
                created.getFullYear() ===
                    today.getFullYear()
            );
        }).length;

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN"
        );
    };

    // =====================================================
    // VIEW USER
    // =====================================================

    const viewUser = (user) => {
        if (!user) return;

        setSelectedUser(user);
        setShowViewModal(true);
    };

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEditModal = (user) => {
        if (!user) return;

        setEditUser({
            _id: user._id || "",
            name: user.name || "",
            phone: user.phone || "",
            city: user.city || "",
            state: user.state || "",
            pincode: user.pincode || "",
            address: user.address || "",
            role: user.role || "user",
        });

        setShowViewModal(false);
        setShowEditModal(true);
    };

    // =====================================================
    // HANDLE EDIT INPUT
    // =====================================================

    const handleEditChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setEditUser((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // UPDATE USER
    // =====================================================

    const updateUser = async () => {
        if (!editUser._id) {
            toast.error("User ID not found.");
            return;
        }

        try {
            const token =
                localStorage.getItem("token");

            const response =
                await axios.put(
                    `${API_URL}/api/admin/users/${editUser._id}`,
                    {
                        name: editUser.name.trim(),
                        phone: editUser.phone.trim(),
                        city: editUser.city.trim(),
                        state: editUser.state.trim(),
                        pincode: editUser.pincode.trim(),
                        address: editUser.address.trim(),
                        role: editUser.role,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const updatedUser =
                response.data?.user;

            if (updatedUser) {
                setSelectedUser(
                    updatedUser
                );

                setUsers((previousUsers) =>
                    previousUsers.map(
                        (user) =>
                            user._id ===
                            updatedUser._id
                                ? updatedUser
                                : user
                    )
                );
            }

            setShowEditModal(false);

            toast.success(
                response.data?.message ||
                "User updated successfully."
            );
        } catch (err) {
            console.error(
                "UPDATE USER ERROR:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Failed to update user."
            );
        }
    };

    // =====================================================
    // EXPORT CSV
    // =====================================================

    const exportUsers = () => {
        const headers = [
            "Name",
            "Email",
            "Phone",
            "City",
            "Role",
            "Joined",
        ];

        const rows = filteredUsers.map(
            (user) => [
                user?.name || "-",
                user?.email || "-",
                user?.phone || "-",
                user?.city || "-",
                user?.role || "-",
                formatDate(
                    user?.createdAt
                ),
            ]
        );

        const csvContent = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(
                                value
                            ).replace(
                                /"/g,
                                '""'
                            )}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        );

        saveAs(
            blob,
            "Users.csv"
        );
    };

    // =====================================================
    // CLOSE MODALS
    // =====================================================

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedUser(null);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <AdminLayout>
                <div className="users-page">
                    <div
                        className="users-loading"
                        style={{
                            padding: "60px",
                            textAlign: "center",
                            color: "#d4af37",
                            fontSize: "20px",
                        }}
                    >
                        Loading Users...
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
                <div className="users-page">
                    <div
                        style={{
                            padding: "60px",
                            textAlign: "center",
                            color: "#ff6b6b",
                        }}
                    >
                        <h2>
                            {error}
                        </h2>

                        <button
                            type="button"
                            onClick={
                                fetchUsers
                            }
                            className="export-btn"
                            style={{
                                marginTop:
                                    "15px",
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <AdminLayout>

            <div className="users-page">

                {/* =================================================
                    TITLE
                ================================================== */}

                <h1 className="users-title">
                    Users Management
                </h1>


                {/* =================================================
                    STATS
                ================================================== */}

                <div className="users-stats-grid">

                    <div className="stats-card">
                        <h3>
                            Total Users
                        </h3>

                        <span>
                            {totalUsers}
                        </span>
                    </div>

                    <div className="stats-card">
                        <h3>
                            Customers
                        </h3>

                        <span>
                            {totalCustomers}
                        </span>
                    </div>

                    <div className="stats-card">
                        <h3>
                            Admins
                        </h3>

                        <span>
                            {totalAdmins}
                        </span>
                    </div>

                    <div className="stats-card">
                        <h3>
                            New This Month
                        </h3>

                        <span>
                            {newUsersThisMonth}
                        </span>
                    </div>

                </div>


                {/* =================================================
                    TOOLBAR
                ================================================== */}

                <div className="users-top">

                    <div className="users-count">

                        <span>
                            Total Users:
                            <strong>
                                {
                                    filteredUsers.length
                                }
                            </strong>
                        </span>

                        <button
                            type="button"
                            className="export-btn"
                            onClick={
                                exportUsers
                            }
                        >
                            Export CSV
                        </button>

                    </div>


                    <div className="users-actions">

                        <input
                            type="text"
                            className="search-box"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(
                                e
                            ) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />


                        <select
                            className="filter-box"
                            value={
                                roleFilter
                            }
                            onChange={(
                                e
                            ) =>
                                setRoleFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="all">
                                All Users
                            </option>

                            <option value="user">
                                Users
                            </option>

                            <option value="admin">
                                Admins
                            </option>
                        </select>


                        <select
                            className="filter-box"
                            value={
                                sortBy
                            }
                            onChange={(
                                e
                            ) =>
                                setSortBy(
                                    e.target.value
                                )
                            }
                        >
                            <option value="newest">
                                Newest First
                            </option>

                            <option value="oldest">
                                Oldest First
                            </option>

                            <option value="az">
                                Name (A-Z)
                            </option>

                            <option value="za">
                                Name (Z-A)
                            </option>
                        </select>

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================== */}

                <div className="users-table">

                    <table>

                        <thead>

                            <tr>
                                <th>
                                    #
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    City
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Joined
                                </th>

                                <th>
                                    Actions
                                </th>
                            </tr>

                        </thead>


                        <tbody>

                            {currentUsers.length >
                            0 ? (

                                currentUsers.map(
                                    (
                                        user,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                user._id
                                            }
                                        >

                                            <td>
                                                {
                                                    indexOfFirstUser +
                                                    index +
                                                    1
                                                }
                                            </td>


                                            <td>
                                                <strong>
                                                    {
                                                        user.name ||
                                                        "Unknown User"
                                                    }
                                                </strong>
                                            </td>


                                            <td>
                                                {
                                                    user.email ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    user.phone ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    user.city ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`role ${
                                                        user.role ||
                                                        "user"
                                                    }`}
                                                >
                                                    {
                                                        user.role ||
                                                        "user"
                                                    }
                                                </span>

                                            </td>


                                            <td>
                                                {formatDate(
                                                    user.createdAt
                                                )}
                                            </td>


                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="view-btn"
                                                        title="View User"
                                                        onClick={() =>
                                                            viewUser(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        title="Delete User"
                                                        onClick={() =>
                                                            deleteUser(
                                                                user._id
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={
                                                                18
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
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "40px",
                                            color:
                                                "#999",
                                        }}
                                    >
                                        No users match your search.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    PAGINATION
                ================================================== */}

                {filteredUsers.length >
                    0 && (

                    <div className="pagination">

                        <button
                            type="button"
                            disabled={
                                safeCurrentPage ===
                                1
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) =>
                                        Math.max(
                                            1,
                                            page -
                                                1
                                        )
                                )
                            }
                            title="Previous Page"
                        >
                            <ChevronLeft
                                size={18}
                            />
                        </button>


                        {Array.from(
                            {
                                length:
                                    totalPages,
                            },
                            (_, index) => (
                                <button
                                    type="button"
                                    key={
                                        index
                                    }
                                    className={
                                        safeCurrentPage ===
                                        index +
                                            1
                                            ? "active-page"
                                            : ""
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            index +
                                                1
                                        )
                                    }
                                >
                                    {
                                        index +
                                        1
                                    }
                                </button>
                            )
                        )}


                        <button
                            type="button"
                            disabled={
                                safeCurrentPage ===
                                totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) =>
                                        Math.min(
                                            totalPages,
                                            page +
                                                1
                                        )
                                )
                            }
                            title="Next Page"
                        >
                            <ChevronRight
                                size={18}
                            />
                        </button>

                    </div>

                )}

            </div>


            {/* =====================================================
                VIEW USER MODAL
            ====================================================== */}

            {showViewModal &&
                selectedUser && (

                    <div
                        className="modal-overlay"
                        onClick={
                            closeViewModal
                        }
                    >

                        <div
                            className="user-modal"
                            onClick={(
                                e
                            ) =>
                                e.stopPropagation()
                            }
                        >

                            {/* HEADER */}

                            <div className="modal-header">

                                <div>
                                    <h2>
                                        User Details
                                    </h2>

                                    <span className="online-status">
                                        ● Active
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="close-btn"
                                    onClick={
                                        closeViewModal
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            {/* BODY */}

                            <div className="modal-body">

                                {/* PROFILE */}

                                <div className="user-profile">

                                    <div className="user-avatar">
                                        {(
                                            selectedUser.name ||
                                            "U"
                                        )
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h3>
                                            {
                                                selectedUser.name ||
                                                "Unknown User"
                                            }
                                        </h3>

                                        <span
                                            className={`user-role ${
                                                selectedUser.role ||
                                                "user"
                                            }`}
                                        >
                                            {
                                                selectedUser.role ||
                                                "user"
                                            }
                                        </span>
                                    </div>

                                </div>


                                {/* INFORMATION */}

                                <div className="user-info">

                                    <p>
                                        <strong>
                                            Email
                                        </strong>

                                        <span>
                                            {
                                                selectedUser.email ||
                                                "-"
                                            }
                                        </span>
                                    </p>


                                    <p>
                                        <strong>
                                            Phone
                                        </strong>

                                        <span>
                                            {
                                                selectedUser.phone ||
                                                "-"
                                            }
                                        </span>
                                    </p>


                                    <p>
                                        <strong>
                                            City
                                        </strong>

                                        <span>
                                            {
                                                selectedUser.city ||
                                                "-"
                                            }
                                        </span>
                                    </p>


                                    <p>
                                        <strong>
                                            State
                                        </strong>

                                        <span>
                                            {
                                                selectedUser.state ||
                                                "-"
                                            }
                                        </span>
                                    </p>


                                    <p>
                                        <strong>
                                            Pincode
                                        </strong>

                                        <span>
                                            {
                                                selectedUser.pincode ||
                                                "-"
                                            }
                                        </span>
                                    </p>


                                    <p>
                                        <strong>
                                            Address
                                        </strong>

                                        <span>
                                            {
                                                selectedUser.address ||
                                                "-"
                                            }
                                        </span>
                                    </p>


                                    <p>
                                        <strong>
                                            Joined
                                        </strong>

                                        <span>
                                            {formatDate(
                                                selectedUser.createdAt
                                            )}
                                        </span>
                                    </p>

                                </div>


                                {/* USER STATS */}

                                <div className="user-stats">

                                    <div className="stat-box">
                                        <h4>
                                            Orders
                                        </h4>

                                        <span>
                                            {
                                                selectedUser
                                                    .orders
                                                    ?.length ||
                                                0
                                            }
                                        </span>
                                    </div>


                                    <div className="stat-box">
                                        <h4>
                                            Wishlist
                                        </h4>

                                        <span>
                                            {
                                                selectedUser
                                                    .wishlist
                                                    ?.length ||
                                                0
                                            }
                                        </span>
                                    </div>


                                    <div className="stat-box">
                                        <h4>
                                            Cart
                                        </h4>

                                        <span>
                                            {
                                                selectedUser
                                                    .cart
                                                    ?.length ||
                                                0
                                            }
                                        </span>
                                    </div>

                                </div>


                                {/* ACCOUNT INFORMATION */}

                                <div className="account-info">

                                    <h3>
                                        Account Information
                                    </h3>

                                    <div className="account-grid">

                                        <div className="account-card">
                                            <h4>
                                                User ID
                                            </h4>

                                            <p>
                                                {
                                                    selectedUser._id ||
                                                    "-"
                                                }
                                            </p>
                                        </div>


                                        <div className="account-card">
                                            <h4>
                                                Created At
                                            </h4>

                                            <p>
                                                {selectedUser.createdAt
                                                    ? new Date(
                                                          selectedUser.createdAt
                                                      ).toLocaleString(
                                                          "en-IN"
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>


                                        <div className="account-card">
                                            <h4>
                                                Last Updated
                                            </h4>

                                            <p>
                                                {selectedUser.updatedAt
                                                    ? new Date(
                                                          selectedUser.updatedAt
                                                      ).toLocaleString(
                                                          "en-IN"
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>


                                        <div className="account-card">
                                            <h4>
                                                Account Age
                                            </h4>

                                            <p>
                                                {selectedUser.createdAt
                                                    ? Math.max(
                                                          0,
                                                          Math.floor(
                                                              (
                                                                  new Date() -
                                                                  new Date(
                                                                      selectedUser.createdAt
                                                                  )
                                                              ) /
                                                                  (
                                                                      1000 *
                                                                      60 *
                                                                      60 *
                                                                      24
                                                                  )
                                                          )
                                                      )
                                                    : 0}{" "}
                                                Days
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="edit-user-btn"
                                    onClick={() =>
                                        openEditModal(
                                            selectedUser
                                        )
                                    }
                                >
                                    Edit User
                                </button>


                                <button
                                    type="button"
                                    className="delete-user-btn"
                                    onClick={() => {
                                        setShowViewModal(
                                            false
                                        );

                                        deleteUser(
                                            selectedUser._id
                                        );
                                    }}
                                >
                                    Delete User
                                </button>

                            </div>

                        </div>

                    </div>
                )}


            {/* =====================================================
                EDIT USER MODAL
            ====================================================== */}

            {showEditModal && (

                <div
                    className="modal-overlay"
                    onClick={
                        closeEditModal
                    }
                >

                    <div
                        className="user-modal"
                        onClick={(
                            e
                        ) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h2>
                                Edit User
                            </h2>

                            <button
                                type="button"
                                className="close-btn"
                                onClick={
                                    closeEditModal
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-body">

                            <div className="edit-form">

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={
                                        editUser.name
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />


                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    value={
                                        editUser.phone
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />


                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={
                                        editUser.city
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />


                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={
                                        editUser.state
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />


                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="Pincode"
                                    value={
                                        editUser.pincode
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />


                                <textarea
                                    name="address"
                                    rows="4"
                                    placeholder="Address"
                                    value={
                                        editUser.address
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                />


                                <select
                                    name="role"
                                    value={
                                        editUser.role
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                >
                                    <option value="user">
                                        User
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>

                            </div>

                        </div>


                        <div className="modal-actions">

                            <button
                                type="button"
                                className="delete-user-btn"
                                onClick={
                                    closeEditModal
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="edit-user-btn"
                                onClick={
                                    updateUser
                                }
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </AdminLayout>
    );
};

export default Users;