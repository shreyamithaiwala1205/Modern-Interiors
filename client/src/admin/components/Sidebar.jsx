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
    CalendarDays,
    Tag,
    Mail,
    FolderKanban,
    Layers,
    MonitorCog,
    MailCheck,
    Star,
    LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const logoutHandler = () => {
        logout({ notify: false });
        toast.success("Logged out successfully.");
        navigate("/", { replace: true });
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

                <NavLink
                    to="/admin/project-categories"
                    className={({ isActive }) =>
                        `admin-sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <Layers size={21} />
                    <span>Project Categories</span>
                </NavLink>

                <NavLink
                    to="/admin/reviews"
                    className={navClass}
                >
                    <Star size={21} />
                    <span>Reviews</span>
                </NavLink>


                {/* WEBSITE */}

                <div className="admin-sidebar-section-title">
                    WEBSITE
                </div>


                <NavLink
                    to="/admin/home-settings"
                    className={navClass}
                >
                    <MonitorCog size={21} />
                    <span>Home Page Sections</span>
                </NavLink>

                <NavLink
                    to="/admin/email-settings"
                    className={navClass}
                >
                    <MailCheck size={21} />
                    <span>Email Notifications</span>
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