import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
  FaTachometerAlt,
  FaCalendarCheck,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

import "../css/Navbar.css";

function Navbar() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();

  const { user, logout } = useAuth();
  const { cart } = useCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const closeMenu = () => setMenu(false);

  // Close menu automatically on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menu]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    closeMenu();
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          {/* ===========================
                Logo
          =========================== */}
          <Link
            to="/"
            className="logo"
            onClick={closeMenu}
          >
            Modern<span>Interiors</span>
          </Link>

          {/* ===========================
                Navigation Links & Drawer
          =========================== */}
          <ul
            className={
              menu
                ? "nav-links active"
                : "nav-links"
            }
          >
            {/* Mobile Drawer Header */}
            <li className="mobile-drawer-header">
              <span className="mobile-drawer-title">Navigation</span>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={closeMenu}
                aria-label="Close Menu"
              >
                <FaTimes />
              </button>
            </li>

            <li>
              <NavLink
                to="/"
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                onClick={closeMenu}
              >
                About
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/gallery"
                onClick={closeMenu}
              >
                Projects
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/furniture"
                onClick={closeMenu}
              >
                Furniture
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                onClick={closeMenu}
              >
                Contact
              </NavLink>
            </li>

            {/* ===========================
                  User Dropdown (Desktop & Mobile)
            =========================== */}
            {user ? (
              <li className="user-dropdown">
                <div className="user-info">
                  <FaUserCircle className="user-icon" />
                  <span>{user.name}</span>
                </div>

                <div className="dropdown-content">
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMenu}
                      className="admin-dropdown-link"
                    >
                      <FaTachometerAlt className="dropdown-icon" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={closeMenu}
                  >
                    <FaUser className="dropdown-icon" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={closeMenu}
                  >
                    <FaHeart className="dropdown-icon" />
                    <span>Wishlist</span>
                  </Link>

                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="cart-link"
                  >
                    <div className="cart-icon-wrapper">
                      <FaShoppingCart className="dropdown-icon" />
                      {cart.length > 0 && (
                        <span className="cart-count">
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <span>Cart</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={closeMenu}
                  >
                    <FaBoxOpen className="dropdown-icon" />
                    <span>My Orders</span>
                  </Link>

                  <button type="button" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </li>
            ) : (
              <li className="account-item">
                <NavLink
                  to="/account"
                  className="account-link"
                  onClick={closeMenu}
                  title="Sign In / Register"
                >
                  <FaUserCircle />
                  <span className="account-text">Account</span>
                </NavLink>
              </li>
            )}

            {/* Mobile Book Consultation CTA */}
            <li className="mobile-cta-item">
              <Link
                to="/consultation"
                className="mobile-book-btn"
                onClick={closeMenu}
              >
                <FaCalendarCheck />
                <span>Book Consultation</span>
              </Link>
            </li>
          </ul>

          {/* ===========================
                Right Actions Area
          =========================== */}
          <div className="nav-right-actions">
            {/* Always-visible Cart Icon */}
            {user && (
              <Link
                to="/cart"
                className="nav-cart-btn"
                aria-label="View Cart"
                title="View Cart"
              >
                <div className="cart-icon-wrapper">
                  <FaShoppingCart />
                  {totalItems > 0 && (
                    <span className="cart-count">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* Desktop Book Consultation Button */}
            <Link
              to="/consultation"
              className="book-btn"
            >
              Book Consultation
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              className="menu-icon"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Close Menu" : "Open Menu"}
            >
              {menu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`nav-backdrop ${menu ? "active" : ""}`}
        onClick={closeMenu}
      />
    </>
  );
}

export default Navbar;