import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaHeart,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
  FaTachometerAlt,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaIdCard,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../css/Profile.css";

const Profile = () => {
  const { user, logout, validateAuth } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  // States & Cities
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Profile Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Password Form Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Select Custom Styling
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#222222",
      borderColor: state.isFocused ? "#D4AF37" : "#383838",
      borderRadius: "10px",
      minHeight: "46px",
      color: "#ffffff",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(212, 175, 55, 0.15)" : "none",
      "&:hover": {
        borderColor: "#D4AF37",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#ffffff",
      fontSize: "14px",
    }),
    input: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#777777",
      fontSize: "13.5px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1e1e1e",
      border: "1px solid #333333",
      borderRadius: "10px",
      zIndex: 999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#D4AF37" : "#1e1e1e",
      color: state.isFocused ? "#111111" : "#ffffff",
      cursor: "pointer",
      fontSize: "13.5px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#D4AF37",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  // Fetch States
  const fetchStates = async () => {
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: "India" }
      );
      setStates(res.data.data.states || []);
    } catch (error) {
      console.log("FETCH STATES ERROR:", error);
    }
  };

  // Fetch Cities
  const fetchCities = async (stateName) => {
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: "India", state: stateName }
      );
      setCities(res.data.data || []);
    } catch (error) {
      console.log("FETCH CITIES ERROR:", error);
      setCities([]);
    }
  };

  // Fetch User Orders Count
  const fetchOrdersCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && Array.isArray(res.data.orders)) {
        setOrdersCount(res.data.orders.length);
      }
    } catch (err) {
      console.log("FETCH ORDERS ERROR:", err);
    }
  };

  // Initial Load
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });

      if (user.state) {
        fetchCities(user.state);
      }
    }
    fetchStates();
    fetchOrdersCount();
  }, [user]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to update profile");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Profile updated successfully! 🎉");
        await validateAuth();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired, please login again");
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Password changed successfully! 🔒");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const stateOptions = states.map((s) => ({ value: s.name, label: s.name }));
  const cityOptions = cities.map((c) => ({ value: c, label: c }));

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const memberYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "2026";

  return (
    <section className="profile-page">
      <div className="profile-container">
        {/* =========================================
            HERO / HEADER USER CARD
        ========================================== */}
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-circle">{userInitials}</div>
              <span
                className={`profile-role-badge ${
                  user?.role === "admin" ? "admin" : ""
                }`}
              >
                {user?.role === "admin" ? "Admin" : "Customer"}
              </span>
            </div>

            <div className="profile-user-meta">
              <h1>{user?.name || "Member"}</h1>
              <p>
                <FaEnvelope />
                <span>{user?.email}</span>
              </p>
              <span className="profile-member-date">
                <FaCalendarAlt style={{ marginRight: 5 }} />
                Member Since {memberYear}
              </span>
            </div>
          </div>

          {/* QUICK HERO STATS */}
          <div className="profile-hero-stats">
            <Link to="/orders" className="profile-stat-box">
              <span className="profile-stat-val">{ordersCount}</span>
              <span className="profile-stat-lbl">Orders</span>
            </Link>

            <Link to="/wishlist" className="profile-stat-box">
              <span className="profile-stat-val">{wishlist?.length || 0}</span>
              <span className="profile-stat-lbl">Wishlist</span>
            </Link>

            <Link to="/cart" className="profile-stat-box">
              <span className="profile-stat-val">{cart?.length || 0}</span>
              <span className="profile-stat-lbl">Cart</span>
            </Link>
          </div>
        </div>

        {/* =========================================
            MAIN BODY (SIDEBAR TABS + CONTENT AREA)
        ========================================== */}
        <div className="profile-main-layout">
          {/* TABS SIDEBAR */}
          <aside className="profile-tabs-sidebar">
            <button
              type="button"
              className={`profile-tab-btn ${
                activeTab === "personal" ? "active" : ""
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <FaUser />
              <span>Personal Details</span>
            </button>

            <button
              type="button"
              className={`profile-tab-btn ${
                activeTab === "address" ? "active" : ""
              }`}
              onClick={() => setActiveTab("address")}
            >
              <FaMapMarkerAlt />
              <span>Delivery Address</span>
            </button>

            <button
              type="button"
              className={`profile-tab-btn ${
                activeTab === "security" ? "active" : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              <FaLock />
              <span>Password & Security</span>
            </button>

            <button
              type="button"
              className={`profile-tab-btn ${
                activeTab === "shortcuts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("shortcuts")}
            >
              <FaIdCard />
              <span>Quick Shortcuts</span>
            </button>

            <button
              type="button"
              className="profile-tab-btn profile-tab-logout-btn"
              onClick={() => logout({ notify: true, reason: "Logged out successfully." })}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </aside>

          {/* CONTENT CARD */}
          <main className="profile-content-card">
            {/* =========================================
                TAB 1: PERSONAL INFORMATION
            ========================================== */}
            {activeTab === "personal" && (
              <div>
                <div className="profile-content-header">
                  <h2>Personal Information</h2>
                  <p>Update your personal contact details and name.</p>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="profile-form-grid">
                    <div className="profile-form-group">
                      <label>
                        <FaUser /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>
                        <FaPhone /> Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                      />
                    </div>

                    <div className="profile-form-group full-width">
                      <label>
                        <FaEnvelope /> Email Address (Read-only)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        title="Email address cannot be changed"
                      />
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <button
                      type="submit"
                      className="profile-save-btn"
                      disabled={loading}
                    >
                      <FaCheckCircle />
                      <span>{loading ? "Saving Changes..." : "Save Personal Details"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =========================================
                TAB 2: DELIVERY ADDRESS
            ========================================== */}
            {activeTab === "address" && (
              <div>
                <div className="profile-content-header">
                  <h2>Shipping & Delivery Address</h2>
                  <p>Manage your default delivery address for faster checkouts.</p>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="profile-form-grid">
                    <div className="profile-form-group full-width">
                      <label>
                        <FaMapMarkerAlt /> Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Apartment, building, street, locality"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>State</label>
                      <Select
                        styles={selectStyles}
                        options={stateOptions}
                        value={
                          stateOptions.find((opt) => opt.value === formData.state) ||
                          null
                        }
                        onChange={(selected) => {
                          const stateVal = selected ? selected.value : "";
                          setFormData({
                            ...formData,
                            state: stateVal,
                            city: "",
                          });
                          if (stateVal) {
                            fetchCities(stateVal);
                          } else {
                            setCities([]);
                          }
                        }}
                        placeholder="Search & Select State..."
                        isClearable
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>City</label>
                      <Select
                        styles={selectStyles}
                        options={cityOptions}
                        value={
                          cityOptions.find((opt) => opt.value === formData.city) ||
                          null
                        }
                        onChange={(selected) => {
                          setFormData({
                            ...formData,
                            city: selected ? selected.value : "",
                          });
                        }}
                        placeholder={
                          formData.state
                            ? "Search & Select City..."
                            : "Select State First"
                        }
                        isDisabled={!formData.state}
                        isClearable
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>Postal Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="6-digit pincode (e.g. 380001)"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <button
                      type="submit"
                      className="profile-save-btn"
                      disabled={loading}
                    >
                      <FaCheckCircle />
                      <span>{loading ? "Saving Address..." : "Save Address"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =========================================
                TAB 3: SECURITY & PASSWORD
            ========================================== */}
            {activeTab === "security" && (
              <div>
                <div className="profile-content-header">
                  <h2>Password & Security</h2>
                  <p>Change your account password and safeguard your account.</p>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="profile-form-grid">
                    <div className="profile-form-group full-width">
                      <label>
                        <FaLock /> Current Password
                      </label>
                      <div className="profile-input-wrap">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter your existing password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle-icon"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-form-group">
                      <label>New Password</label>
                      <div className="profile-input-wrap">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle-icon"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-form-group">
                      <label>Confirm New Password</label>
                      <div className="profile-input-wrap">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle-icon"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <button
                      type="submit"
                      className="profile-save-btn"
                      disabled={passwordLoading}
                    >
                      <FaShieldAlt />
                      <span>
                        {passwordLoading
                          ? "Updating Password..."
                          : "Change Password"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =========================================
                TAB 4: SHORTCUTS
            ========================================== */}
            {activeTab === "shortcuts" && (
              <div>
                <div className="profile-content-header">
                  <h2>Quick Shortcuts</h2>
                  <p>Access your favorite pages, orders, and services quickly.</p>
                </div>

                <div className="profile-shortcuts-grid">
                  <Link to="/orders" className="profile-shortcut-card">
                    <div className="profile-shortcut-icon">
                      <FaBoxOpen />
                    </div>
                    <div className="profile-shortcut-text">
                      <h3>My Orders</h3>
                      <p>View past orders, track delivery, and view invoices.</p>
                    </div>
                  </Link>

                  <Link to="/wishlist" className="profile-shortcut-card">
                    <div className="profile-shortcut-icon red">
                      <FaHeart />
                    </div>
                    <div className="profile-shortcut-text">
                      <h3>Wishlist Items</h3>
                      <p>Manage saved items and move them to cart anytime.</p>
                    </div>
                  </Link>

                  <Link to="/cart" className="profile-shortcut-card">
                    <div className="profile-shortcut-icon blue">
                      <FaShoppingCart />
                    </div>
                    <div className="profile-shortcut-text">
                      <h3>Shopping Cart</h3>
                      <p>Review items in your cart and proceed to checkout.</p>
                    </div>
                  </Link>

                  <Link to="/consultation" className="profile-shortcut-card">
                    <div className="profile-shortcut-icon green">
                      <FaCalendarAlt />
                    </div>
                    <div className="profile-shortcut-text">
                      <h3>Book Consultation</h3>
                      <p>Schedule a 1-on-1 design consultation session.</p>
                    </div>
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="profile-shortcut-card"
                      style={{ gridColumn: "span 2" }}
                    >
                      <div className="profile-shortcut-icon">
                        <FaTachometerAlt />
                      </div>
                      <div className="profile-shortcut-text">
                        <h3>Admin Management Dashboard</h3>
                        <p>
                          Manage products, project categories, orders, coupons, and inquiries.
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default Profile;
