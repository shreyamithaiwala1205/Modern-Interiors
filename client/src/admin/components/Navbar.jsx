import {
  LogOut,
  Bell,
  Search,
  UserCircle,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  useAuth,
} from "../../context/AuthContext";


const Navbar = () => {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  /* =====================================================
     STATES
  ===================================================== */

  const [search, setSearch] = useState("");

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);


  const searchRef = useRef(null);

  const notificationRef = useRef(null);


  /* =====================================================
     ADMIN NAME
  ===================================================== */

  const adminName = user?.name || "Admin";


  /* =====================================================
     DATE
  ===================================================== */

  const today =
    new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });


  /* =====================================================
     SEARCH PAGES
  ===================================================== */

  const searchItems = [
    {
      label: "Dashboard",
      keywords: "dashboard home overview",
      path: "/admin/dashboard",
    },
    {
      label: "Users",
      keywords: "users customers admins clients",
      path: "/admin/users",
    },
    {
      label: "Products",
      keywords: "products furniture items",
      path: "/admin/products",
    },
    {
      label: "Orders",
      keywords: "orders purchases sales",
      path: "/admin/orders",
    },
    {
      label: "Coupons",
      keywords: "coupon discount offers",
      path: "/admin/coupons",
    },
    {
      label: "Consultations",
      keywords: "consultations booking meetings",
      path: "/admin/consultations",
    },
    {
      label: "Contacts",
      keywords: "contacts messages enquiries",
      path: "/admin/contacts",
    },
    {
      label: "Projects",
      keywords: "projects gallery portfolio",
      path: "/admin/projects",
    },
    {
      label: "Project Categories",
      keywords: "project categories category",
      path: "/admin/project-categories",
    },
    {
      label: "Home Page Sections",
      keywords: "home page sections banner hero",
      path: "/admin/home-settings",
    },
    {
      label: "Email Notifications",
      keywords: "email notifications smtp brevo mail",
      path: "/admin/email-settings",
    },
  ];


  /* =====================================================
     SEARCH RESULTS
  ===================================================== */

  const searchResults = search.trim()
    ? searchItems.filter((item) => {

        const query =
          search.trim().toLowerCase();

        return (
          item.label
            .toLowerCase()
            .includes(query) ||
          item.keywords
            .toLowerCase()
            .includes(query)
        );

      })
    : [];


  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearchChange = (e) => {

    const value = e.target.value;

    setSearch(value);

    setShowSearchResults(
      value.trim().length > 0
    );

  };


  const handleSearchSubmit = (e) => {

    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    const exactMatch =
      searchItems.find(
        (item) =>
          item.label.toLowerCase() ===
          query.toLowerCase()
      );

    const firstMatch =
      exactMatch || searchResults[0];

    if (firstMatch) {

      navigate(firstMatch.path);

      setSearch("");

      setShowSearchResults(false);

    } else {

      toast.error(
        "No matching admin page found."
      );

    }

  };


  const openSearchResult = (path) => {

    navigate(path);

    setSearch("");

    setShowSearchResults(false);

  };


  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const fetchNotifications = async () => {

    try {

      setLoadingNotifications(true);

      const token =
        localStorage.getItem("token");

      const { data } =
        await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const dashboard =
        data?.dashboard || {};

      const list = [];


      if (
        Array.isArray(
          dashboard.outOfStockProducts
        )
      ) {

        dashboard.outOfStockProducts
          .slice(0, 3)
          .forEach((product) => {

            list.push({
              id:
                `out-${product._id}`,
              title:
                "Out of Stock",
              message:
                `${product.name || "Product"} is out of stock.`,
              path:
                "/admin/products",
              icon:
                <Package size={16} />,
            });

          });

      }


      if (
        Array.isArray(
          dashboard.lowStockProducts
        )
      ) {

        dashboard.lowStockProducts
          .filter(
            (product) =>
              Number(product.stock) > 0
          )
          .slice(0, 3)
          .forEach((product) => {

            list.push({
              id:
                `low-${product._id}`,
              title:
                "Low Stock",
              message:
                `${product.name || "Product"} has only ${product.stock} item(s) left.`,
              path:
                "/admin/products",
              icon:
                <Package size={16} />,
            });

          });

      }


      if (
        Array.isArray(
          dashboard.recentOrders
        )
      ) {

        dashboard.recentOrders
          .slice(0, 3)
          .forEach((order) => {

            list.push({
              id:
                `order-${order._id}`,
              title:
                "Recent Order",
              message:
                `${order.orderNumber || "New order"} received.`,
              path:
                "/admin/orders",
              icon:
                <ShoppingBag size={16} />,
            });

          });

      }


      if (list.length === 0) {

        list.push({
          id: "none",
          title: "No New Notifications",
          message:
            "Everything looks good right now.",
          path: "",
          icon:
            <Bell size={16} />,
        });

      }


      setNotifications(
        list.slice(0, 8)
      );

    } catch (error) {

      console.error(
        "FETCH NOTIFICATIONS ERROR:",
        error
      );

      setNotifications([
        {
          id: "error",
          title: "Notifications",
          message:
            "Unable to load notifications.",
          path: "",
          icon:
            <Bell size={16} />,
        },
      ]);

    } finally {

      setLoadingNotifications(false);

    }

  };


  const toggleNotifications = async () => {

    const next =
      !showNotifications;

    setShowNotifications(next);

    setShowSearchResults(false);


    if (
      next &&
      notifications.length === 0
    ) {

      await fetchNotifications();

    }

  };


  const handleNotificationClick =
    (notification) => {

      setShowNotifications(false);

      if (notification.path) {

        navigate(notification.path);

      }

    };


  /* =====================================================
     OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target
        )
      ) {

        setShowSearchResults(false);

      }


      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {

        setShowNotifications(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logoutHandler = () => {

    logout({
      notify: false,
    });

    toast.success(
      "Logged out successfully."
    );

    navigate(
      "/",
      {
        replace: true,
      }
    );

  };


  return (

    <header className="admin-navbar">


      {/* =================================================
          LEFT
      ================================================= */}

      <div className="navbar-left">

        <h2>
          Dashboard
        </h2>

        <p>
          {today}
        </p>

      </div>


      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="navbar-right">


        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="navbar-search-wrapper"
          ref={searchRef}
        >

          <form
            className="navbar-search"
            onSubmit={
              handleSearchSubmit
            }
          >

            <Search size={18} />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={
                handleSearchChange
              }
              onFocus={() => {

                if (search.trim()) {

                  setShowSearchResults(
                    true
                  );

                }

              }}
            />

            {search && (

              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {

                  setSearch("");

                  setShowSearchResults(
                    false
                  );

                }}
              >
                <X size={15} />
              </button>

            )}

          </form>


          {/* SEARCH DROPDOWN */}

          {showSearchResults &&
            search.trim() && (

              <div className="admin-search-dropdown">

                {searchResults.length > 0 ? (

                  searchResults.map(
                    (item) => (

                      <button
                        type="button"
                        key={item.path}
                        className="admin-search-item"
                        onClick={() =>
                          openSearchResult(
                            item.path
                          )
                        }
                      >

                        <Search
                          size={15}
                        />

                        <span>
                          {item.label}
                        </span>

                      </button>

                    )
                  )

                ) : (

                  <div className="admin-search-empty">

                    No matching page found.

                  </div>

                )}

              </div>

            )}

        </div>


        {/* =================================================
            NOTIFICATION
        ================================================= */}

        <div
          className="admin-notification-wrapper"
          ref={notificationRef}
        >

          <button
            type="button"
            className="navbar-icon"
            onClick={
              toggleNotifications
            }
            aria-label="Notifications"
          >

            <Bell size={19} />

            {notifications.length >
              0 && (

              <span className="notification-count">

                {
                  Math.min(
                    notifications.length,
                    9
                  )
                }

              </span>

            )}

          </button>


          {showNotifications && (

            <div className="admin-notification-dropdown">


              <div className="notification-header">

                <h4>
                  Notifications
                </h4>

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(
                      false
                    )
                  }
                >
                  <X size={16} />
                </button>

              </div>


              <div className="notification-body">

                {loadingNotifications ? (

                  <div className="notification-empty">

                    Loading notifications...

                  </div>

                ) : (

                  notifications.map(
                    (notification) => (

                      <button
                        type="button"
                        key={
                          notification.id
                        }
                        className="notification-item"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                      >

                        <div className="notification-icon">

                          {
                            notification.icon
                          }

                        </div>


                        <div className="notification-content">

                          <strong>
                            {
                              notification.title
                            }
                          </strong>

                          <span>
                            {
                              notification.message
                            }
                          </span>

                        </div>

                      </button>

                    )
                  )

                )}

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            ADMIN PROFILE
        ================================================= */}

        <div className="admin-profile">

          <UserCircle size={36} />

          <div>

            <h4>
              {adminName}
            </h4>

            <span>
              Administrator
            </span>

          </div>

        </div>


        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          type="button"
          className="admin-logout"
          onClick={
            logoutHandler
          }
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </header>

  );

};


export default Navbar;