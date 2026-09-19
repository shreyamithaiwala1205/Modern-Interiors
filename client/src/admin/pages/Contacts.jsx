import {
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "axios";

import {
    Eye,
    Trash2,
    Search,
    Mail,
    CheckCircle,
    CircleAlert,
    MessageCircle,
    RefreshCw,
    X,
    Download,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminLayout from "../AdminLayout";

import "../css/Contacts.css";

const API =
    "http://localhost:5000/api/admin/contacts";

const Contacts = () => {
    const [contacts, setContacts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [selectedContact, setSelectedContact] =
        useState(null);

    const [showModal, setShowModal] =
        useState(false);

    const [currentPage, setCurrentPage] =
        useState(1);

    const contactsPerPage = 5;

    // =====================================================
    // FETCH CONTACTS
    // =====================================================

    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError("");

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

            setContacts(
                Array.isArray(
                    response.data
                        ?.contacts
                )
                    ? response.data.contacts
                    : []
            );
        } catch (error) {
            console.error(
                "FETCH CONTACTS ERROR:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                    "Failed to load contacts."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // =====================================================
    // FILTER
    // =====================================================

    const filteredContacts =
        useMemo(() => {
            const text =
                search
                    .trim()
                    .toLowerCase();

            return contacts.filter(
                (contact) => {
                    const name =
                        String(
                            contact.name ||
                                ""
                        ).toLowerCase();

                    const email =
                        String(
                            contact.email ||
                                ""
                        ).toLowerCase();

                    const phone =
                        String(
                            contact.phone ||
                                ""
                        ).toLowerCase();

                    const subject =
                        String(
                            contact.subject ||
                                ""
                        ).toLowerCase();

                    const matchesSearch =
                        name.includes(text) ||
                        email.includes(text) ||
                        phone.includes(text) ||
                        subject.includes(text);

                    const matchesStatus =
                        statusFilter ===
                        "all"
                            ? true
                            : contact.status ===
                              statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            contacts,
            search,
            statusFilter,
        ]);

    // =====================================================
    // STATS
    // =====================================================

    const total =
        contacts.length;

    const unread =
        contacts.filter(
            (item) =>
                item.status ===
                "Unread"
        ).length;

    const read =
        contacts.filter(
            (item) =>
                item.status ===
                "Read"
        ).length;

    const replied =
        contacts.filter(
            (item) =>
                item.status ===
                "Replied"
        ).length;

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        filteredContacts.length /
            contactsPerPage
    );

    const indexOfLast =
        currentPage *
        contactsPerPage;

    const indexOfFirst =
        indexOfLast -
        contactsPerPage;

    const currentContacts =
        filteredContacts.slice(
            indexOfFirst,
            indexOfLast
        );

    // =====================================================
    // VIEW
    // =====================================================

    const viewContact = (
        contact
    ) => {
        setSelectedContact(
            contact
        );

        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        setSelectedContact(null);
        setShowModal(false);
    };

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const updateStatus = async (
        id,
        status
    ) => {
        try {
            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await axios.put(
                    `${API}/${id}`,
                    {
                        status,
                    },
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
                    "Contact status updated."
            );

            setContacts(
                (previous) =>
                    previous.map(
                        (item) =>
                            item._id === id
                                ? {
                                      ...item,
                                      status,
                                  }
                                : item
                    )
            );

            if (
                selectedContact?._id ===
                id
            ) {
                setSelectedContact(
                    (previous) => ({
                        ...previous,
                        status,
                    })
                );
            }
        } catch (error) {
            console.error(
                "UPDATE CONTACT ERROR:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                    "Failed to update status."
            );
        }
    };

    const exportContactsCSV = () => {
    if (contacts.length === 0) {
        toast.error("No contacts available to export");
        return;
    }

    const headers = [
        "No.",
        "Name",
        "Email",
        "Phone",
        "Subject",
        "Status",
        "Date",
        "Message",
    ];

    const rows = contacts.map((contact, index) => [
        index + 1,
        contact.name || "",
        contact.email || "",
        contact.phone || "",
        contact.subject || "",
        contact.status || "",
        formatDate(contact.createdAt),
        contact.message || "",
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
            row
                .map((value) =>
                    `"${String(value).replace(/"/g, '""')}"`
                )
                .join(",")
        ),
    ].join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("Contacts exported successfully");
};

    // =====================================================
    // DELETE
    // =====================================================

    const deleteContact = async (
        id
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this contact message?"
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
                    `${API}/${id}`,
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
                    "Contact deleted successfully."
            );

            setContacts(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item._id !== id
                    )
            );

            if (
                selectedContact?._id ===
                id
            ) {
                closeModal();
            }
        } catch (error) {
            console.error(
                "DELETE CONTACT ERROR:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                    "Failed to delete contact."
            );
        }
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (
        status
    ) => {
        switch (status) {
            case "Read":
                return "read";

            case "Replied":
                return "replied";

            default:
                return "unread";
        }
    };

    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (
        status
    ) => {
        switch (status) {
            case "Read":
                return (
                    <CheckCircle
                        size={14}
                    />
                );

            case "Replied":
                return (
                    <MessageCircle
                        size={14}
                    />
                );

            default:
                return (
                    <CircleAlert
                        size={14}
                    />
                );
        }
    };

    // =====================================================
    // DATE
    // =====================================================

    const formatDate = (
        value
    ) => {
        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
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

/* =====================================================
   LOADING
===================================================== */

if (loading) {

    return (
        <AdminLayout>

            <div className="contacts-page">

                <div className="contacts-loading-screen">

                    <div className="contacts-loader"></div>

                    <h2>
                        Loading Contacts...
                    </h2>

                    <p>
                        Please wait while contact data is loading.
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
                <div className="contacts-error">

                    <CircleAlert
                        size={42}
                    />

                    <h2>
                        {error}
                    </h2>

                    <button
                        type="button"
                        onClick={
                            fetchContacts
                        }
                    >
                        Try Again
                    </button>

                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>

            <div className="contacts-page">

                {/* HEADER */}

                <div className="contacts-header">

                    <div>
                        <h1>
                            Contacts
                        </h1>

                        <p>
                            Manage customer contact messages.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="refresh-contacts-btn"
                        onClick={
                            fetchContacts
                        }
                    >
                        <RefreshCw
                            size={17}
                        />

                        Refresh
                    </button>

                </div>

                {/* STATS */}

                <div className="contacts-stats">

                    <div className="contact-stat-card">
                        <Mail
                            size={24}
                        />

                        <div>
                            <span>
                                Total
                            </span>

                            <strong>
                                {total}
                            </strong>
                        </div>
                    </div>

                    <div className="contact-stat-card unread">
                        <CircleAlert
                            size={24}
                        />

                        <div>
                            <span>
                                Unread
                            </span>

                            <strong>
                                {unread}
                            </strong>
                        </div>
                    </div>

                    <div className="contact-stat-card read">
                        <CheckCircle
                            size={24}
                        />

                        <div>
                            <span>
                                Read
                            </span>

                            <strong>
                                {read}
                            </strong>
                        </div>
                    </div>

                    <div className="contact-stat-card replied">
                        <MessageCircle
                            size={24}
                        />

                        <div>
                            <span>
                                Replied
                            </span>

                            <strong>
                                {replied}
                            </strong>
                        </div>
                    </div>

                </div>

                {/* TOOLBAR */}

                <div className="contacts-toolbar">

                    <div className="contacts-toolbar-left">

                        <span className="total-contacts-text">
                            Total Contacts: <strong>{total}</strong>
                        </span>

                        <button
                            type="button"
                            className="export-contacts-btn"
                            onClick={exportContactsCSV}
                        >
                            <Download size={16} />
                            Export CSV
                        </button>

                    </div>

                    <div className="contacts-toolbar-right">

                        <div className="contact-search">
                            <Search size={18} />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search name, email, phone or subject..."
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
                            <option value="Unread">Unread</option>
                            <option value="Read">Read</option>
                            <option value="Replied">Replied</option>
                        </select>

                    </div>

                </div>

                {/* TABLE */}

                <div className="contacts-table-container">

                    <table className="contacts-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Subject</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {currentContacts.length >
                            0 ? (
                                currentContacts.map(
                                    (
                                        contact,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                contact._id
                                            }
                                        >

                                            <td>
                                                {
                                                    indexOfFirst +
                                                    index +
                                                    1
                                                }
                                            </td>

                                            <td>
                                                <div className="contact-customer">

                                                    <div className="contact-avatar">
                                                        {(
                                                            contact.name ||
                                                            "U"
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {
                                                                contact.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                contact.email
                                                            }
                                                        </span>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <span className="contact-subject">
                                                    {
                                                        contact.subject
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {
                                                    contact.phone ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={`contact-status ${getStatusClass(
                                                        contact.status
                                                    )}`}
                                                >

                                                    {getStatusIcon(
                                                        contact.status
                                                    )}

                                                    {
                                                        contact.status
                                                    }

                                                </span>
                                            </td>

                                            <td>
                                                {
                                                    formatDate(
                                                        contact.createdAt
                                                    )
                                                }
                                            </td>

                                            <td>
                                                <div className="contact-actions">

                                                    <button
                                                        type="button"
                                                        className="contact-view-btn"
                                                        title="View"
                                                        onClick={() =>
                                                            viewContact(
                                                                contact
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="contact-delete-btn"
                                                        title="Delete"
                                                        onClick={() =>
                                                            deleteContact(
                                                                contact._id
                                                            )
                                                        }
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
                                        colSpan="7"
                                        className="no-contacts"
                                    >
                                        No contact messages found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                {filteredContacts.length >
                    0 && (
                    <div className="contacts-pagination">

                        <button
                            type="button"
                            disabled={
                                currentPage ===
                                1
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (
                                        page
                                    ) =>
                                        page -
                                        1
                                )
                            }
                        >
                            ← Previous
                        </button>

                        {Array.from(
                            {
                                length:
                                    totalPages,
                            },
                            (_, index) => (
                                <button
                                    key={
                                        index
                                    }
                                    type="button"
                                    className={
                                        currentPage ===
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
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (
                                        page
                                    ) =>
                                        page +
                                        1
                                )
                            }
                        >
                            Next →
                        </button>

                    </div>
                )}

            </div>

            {/* VIEW MODAL */}

            {showModal &&
                selectedContact && (
                    <div
                        className="contact-modal-overlay"
                        onClick={
                            closeModal
                        }
                    >

                        <div
                            className="contact-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="contact-modal-header">

                                <div>
                                    <span>
                                        CONTACT DETAILS
                                    </span>

                                    <h2>
                                        {
                                            selectedContact.name
                                        }
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="contact-close-btn"
                                    onClick={
                                        closeModal
                                    }
                                >
                                    <X
                                        size={20}
                                    />
                                </button>

                            </div>

                            <div className="contact-modal-body">

                                <div className="contact-detail-grid">

                                    <div className="contact-detail-card">
                                        <span>
                                            Name
                                        </span>

                                        <strong>
                                            {
                                                selectedContact.name
                                            }
                                        </strong>
                                    </div>

                                    <div className="contact-detail-card">
                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {
                                                selectedContact.email
                                            }
                                        </strong>
                                    </div>

                                    <div className="contact-detail-card">
                                        <span>
                                            Phone
                                        </span>

                                        <strong>
                                            {
                                                selectedContact.phone
                                            }
                                        </strong>
                                    </div>

                                    <div className="contact-detail-card">
                                        <span>
                                            Subject
                                        </span>

                                        <strong>
                                            {
                                                selectedContact.subject
                                            }
                                        </strong>
                                    </div>

                                    <div className="contact-detail-card">
                                        <span>
                                            Status
                                        </span>

                                        <strong>
                                            {
                                                selectedContact.status
                                            }
                                        </strong>
                                    </div>

                                    <div className="contact-detail-card">
                                        <span>
                                            Date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                selectedContact.createdAt
                                            )}
                                        </strong>
                                    </div>

                                </div>

                                <div className="contact-message-box">

                                    <span>
                                        Message
                                    </span>

                                    <p>
                                        {
                                            selectedContact.message
                                        }
                                    </p>

                                </div>

                                <div className="contact-status-update">

                                    <label>
                                        Update Status
                                    </label>

                                    <select
                                        value={
                                            selectedContact.status ||
                                            "Unread"
                                        }
                                        onChange={(e) =>
                                            updateStatus(
                                                selectedContact._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Unread">
                                            Unread
                                        </option>

                                        <option value="Read">
                                            Read
                                        </option>

                                        <option value="Replied">
                                            Replied
                                        </option>
                                    </select>

                                </div>

                            </div>

                            <div className="contact-modal-footer">

                                <button
                                    type="button"
                                    className="contact-modal-close-btn"
                                    onClick={
                                        closeModal
                                    }
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="contact-modal-delete-btn"
                                    onClick={() =>
                                        deleteContact(
                                            selectedContact._id
                                        )
                                    }
                                >
                                    <Trash2
                                        size={17}
                                    />

                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </AdminLayout>
    );
};

export default Contacts;