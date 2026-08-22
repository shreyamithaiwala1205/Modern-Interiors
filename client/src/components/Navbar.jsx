import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../css/Navbar.css";

import { useCart } from "../context/CartContext";

function Navbar() {

  const [menu, setMenu] = useState(false);

  const { user, logout } = useAuth();

  const { cart } = useCart();
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const closeMenu = () => setMenu(false);

  const handleLogout = () => {

    logout();

    alert("Logged Out Successfully");

    closeMenu();

    window.location.href = "/";

  };

  return (
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
              Navigation
        =========================== */}

        <ul
          className={
            menu
              ? "nav-links active"
              : "nav-links"
          }
        >

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
                User Dropdown
          =========================== */}

          {user ? (

            <li className="user-dropdown">

              <div className="user-info">

                <FaUserCircle className="user-icon" />

                <span>{user.name}</span>

              </div>

              <div className="dropdown-content">

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

                <button onClick={handleLogout}>

                  <FaSignOutAlt className="dropdown-icon" />

                  <span>Logout</span>

                </button>

              </div>

            </li>

          ) : (

            <li>

              <NavLink
                to="/account"
                className="account-link"
                onClick={closeMenu}
              >
                <FaUserCircle />
              </NavLink>

            </li>

          )}

        </ul>
        {/* ===========================
              Book Consultation Button
        =========================== */}

        <Link
          to="/consultation"
          className="book-btn"
        >
          Book Consultation
        </Link>

        {/* ===========================
              Mobile Menu Icon
        =========================== */}

        <div
          className="menu-icon"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <FaTimes /> : <FaBars />}
        </div>

      </div>

    </nav>
  );
}

export default Navbar;