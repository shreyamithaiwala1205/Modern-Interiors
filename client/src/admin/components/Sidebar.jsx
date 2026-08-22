import {
    NavLink,
    Link,
    useNavigate,
} from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    Sofa,
    ShoppingBag,
    PlusCircle,
    CalendarDays,
    Tag,
    Mail,
    FolderKanban,
    LogOut,
} from "lucide-react";

const Sidebar = () => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/admin/login");
    };

    const navClass = ({ isActive }) =>
        `admin-sidebar-link ${isActive ? "active" : ""}`;

    return (
        <aside className="admin-sidebar">

            {/* =========================================
                LOGO
            ========================================== */}

            <Link
                to="/admin/dashboard"
                className="admin-sidebar-logo"
            >
                <div className="admin-sidebar-logo-title">
                    <span>Modern</span>
                    <span>Interiors</span>
                </div>

                <span className="admin-sidebar-logo-subtitle">
                    ADMIN PANEL
                </span>
            </Link>


            {/* =========================================
                NAVIGATION
            ========================================== */}

            <div className="admin-sidebar-navigation">

                {/* DASHBOARD */}

                <NavLink
                    to="/admin/dashboard"
                    className={navClass}
                >
                    <LayoutDashboard size={21} />
                    <span>Dashboard</span>
                </NavLink>


                {/* MANAGEMENT */}

                <div className="admin-sidebar-section-title">
                    MANAGEMENT
                </div>


                {/* USERS */}

                <NavLink
                    to="/admin/users"
                    className={navClass}
                >
                    <Users size={21} />
                    <span>Users</span>
                </NavLink>


                {/* PRODUCTS */}

                <NavLink
                    to="/admin/products"
                    className={navClass}
                >
                    <Sofa size={21} />
                    <span>Products</span>
                </NavLink>


                {/* ORDERS */}

                <NavLink
                    to="/admin/orders"
                    className={navClass}
                >
                    <ShoppingBag size={21} />
                    <span>Orders</span>
                </NavLink>


                {/* COUPONS */}

                <NavLink
                    to="/admin/coupons"
                    className={navClass}
                >
                    <Tag size={21} />
                    <span>Coupons</span>
                </NavLink>

                <NavLink
                    to="/admin/consultations"
                    className={({ isActive }) =>
                        `admin-sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <CalendarDays size={21} />
                    <span>Consultations</span>
                </NavLink>

                <NavLink
                    to="/admin/contacts"
                    className={({ isActive }) =>
                        `admin-sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <Mail size={21} />

                    <span>
                        Contacts
                    </span>
                </NavLink>

                <NavLink
                    to="/admin/projects"
                    className={({ isActive }) =>
                        `admin-sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <FolderKanban size={21} />
                    <span>Projects</span>
                </NavLink>
                
                {/* INVENTORY */}

                <div className="admin-sidebar-section-title inventory-title">
                    INVENTORY
                </div>


                {/* ADD PRODUCT */}

                <NavLink
                    to="/admin/add-product"
                    className={navClass}
                >
                    <PlusCircle size={21} />
                    <span>Add Product</span>
                </NavLink>

            </div>


            {/* =========================================
                LOGOUT
            ========================================== */}

            <button
                type="button"
                className="admin-sidebar-logout"
                onClick={logoutHandler}
            >
                <LogOut size={19} />
                <span>Logout</span>
            </button>

        </aside>
    );
};

export default Sidebar;