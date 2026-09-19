import React, {
  useState,
  useMemo,
  useEffect,
} from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle, FaShieldAlt, FaLock, FaTag, FaCheckCircle, FaTimes } from "react-icons/fa";

import { useCart } from "../context/CartContext";

import "../css/Checkout.css";
import toast from "react-hot-toast";

function Checkout() {

  const navigate = useNavigate();

  const {
    cart,
    fetchCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const token = localStorage.getItem("token");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Coupons State
  const [couponsList, setCouponsList] = useState([]);
  const [fetchingCoupons, setFetchingCoupons] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [manualCodeMode, setManualCodeMode] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const getSelectStyles = (isError) => ({
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isError ? "#261818" : "#222",
      opacity: state.isDisabled ? 0.7 : 1,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      borderColor: isError ? "#ef4444" : state.isFocused ? "#D4AF37" : "#444",
      borderRadius: "10px",
      minHeight: "48px",
      boxShadow: isError ? "0 0 8px rgba(239, 68, 68, 0.25)" : "none",
      color: "#fff",
      "&:hover": {
        borderColor: isError ? "#ef4444" : "#D4AF37",
      },
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),

    input: (provided) => ({
      ...provided,
      color: "#fff",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: isError ? "#fca5a5" : "#888",
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: "#222",
      border: "1px solid #444",
      borderRadius: "10px",
      zIndex: 99,
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#D4AF37"
        : "#1f1f1f",
      color: state.isFocused ? "#000" : "#fff",
      cursor: "pointer",
    }),

    dropdownIndicator: (provided) => ({
      ...provided,
      color: isError ? "#ef4444" : "#D4AF37",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    clearIndicator: (provided) => ({
      ...provided,
      color: isError ? "#ef4444" : "#D4AF37",
    }),
  });

  const stateOptions = states.map((state) => ({
    value: state.name,
    label: state.name,
  }));

  const cityOptions = cities.map((city) => ({
    value: city,
    label: city,
  }));

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ===========================
  // Validate Single Field
  // ===========================
  const validateField = (name, value, allData = formData) => {
    switch (name) {
      case "fullName": {
        const val = (value || "").trim();
        if (!val) {
          return "Full Name is required.";
        }
        if (!/^[A-Za-z\s]{2,50}$/.test(val)) {
          return "Name must contain only letters and spaces (2 to 50 characters).";
        }
        return "";
      }

      case "phone": {
        const val = (value || "").trim();
        if (!val) {
          return "Phone number is required.";
        }
        const digits = val.replace(/\D/g, "");
        if (digits.length !== 10) {
          return "Phone number must be exactly 10 digits.";
        }
        return "";
      }

      case "email": {
        const val = (value || "").trim();
        if (!val) {
          return "Email address is required.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return "Please enter a valid email address (e.g. name@example.com).";
        }
        return "";
      }

      case "address": {
        const val = (value || "").trim();
        if (!val) {
          return "Delivery address is required.";
        }
        if (val.length < 5) {
          return "Please enter a complete delivery address (min 5 characters).";
        }
        if (val.length > 200) {
          return "Address cannot exceed 200 characters.";
        }
        return "";
      }

      case "state": {
        if (!value || !value.trim()) {
          return "Please select a state.";
        }
        return "";
      }

      case "city": {
        if (!value || !value.trim()) {
          return "Please select a city.";
        }
        return "";
      }

      case "pincode": {
        const val = (value || "").trim();
        if (!val) {
          return "Pincode is required.";
        }
        if (!/^\d{6}$/.test(val)) {
          return "Pincode must be exactly 6 digits.";
        }
        return "";
      }

      default:
        return "";
    }
  };

  // ===========================
  // Validate Entire Form
  // ===========================
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field], formData);
      if (err) {
        newErrors[field] = err;
      }
    });
    setErrors(newErrors);
    return newErrors;
  };

  // ===========================
  // Handle Input Change
  // ===========================
  const handleChange = async (e) => {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    setFormData(updated);

    if (touched[name]) {
      const err = validateField(name, value, updated);
      setErrors((prev) => ({
        ...prev,
        [name]: err,
      }));
    }
  };

  // ===========================
  // Handle Input Blur
  // ===========================
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value, formData);
    setErrors((prev) => ({
      ...prev,
      [name]: err,
    }));
  };

  // ===========================
  // Load Razorpay Script
  // ===========================

  const loadRazorpay = () => {

    return new Promise((resolve) => {

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {

        resolve(true);

      };

      script.onerror = () => {

        resolve(false);

      };

      document.body.appendChild(script);

    });

  };

  // ===========================
  // Total Items
  // ===========================

  const totalItems = useMemo(() => {

    return cart.reduce(

      (total, item) => total + item.quantity,

      0

    );

  }, [cart]);

  // ===========================
  // Total Price
  // ===========================

  const totalPrice = useMemo(() => {

    return cart.reduce(

      (total, item) =>

        total +
        item.furniture.priceValue *
        item.quantity,

      0

    );

  }, [cart]);

  const deliveryCharge = 0;

  const grandTotal = totalPrice + deliveryCharge;

  // Active coupons filtered by minimum order requirement condition
  const applicableCoupons = useMemo(() => {
    return couponsList.filter(
      (c) => c.active && grandTotal >= (c.minAmount || 0)
    );
  }, [couponsList, grandTotal]);

  const lockedCoupons = useMemo(() => {
    return couponsList.filter(
      (c) => c.active && grandTotal < (c.minAmount || 0)
    );
  }, [couponsList, grandTotal]);

  // Recalculate or revalidate coupon when grandTotal changes
  useEffect(() => {
    if (appliedCoupon && couponCode) {
      if (grandTotal < (appliedCoupon.minAmount || 0)) {
        setDiscount(0);
        setFinalAmount(grandTotal);
        setCouponMessage("");
        setAppliedCoupon(null);
        setCouponCode("");
        toast.error(`Coupon ${appliedCoupon.code} removed: Cart total is now below minimum order requirement of ₹${(appliedCoupon.minAmount || 0).toLocaleString("en-IN")}.`);
      } else {
        const discPercent = appliedCoupon.discount || 0;
        const discountAmt = Math.round((grandTotal * discPercent) / 100);
        setDiscount(discountAmt);
        setFinalAmount(Math.max(grandTotal - discountAmt, 0));
      }
    } else {
      setDiscount(0);
      setFinalAmount(grandTotal);
    }
  }, [grandTotal]);

  // ===========================
  // Fetch States
  // ===========================

  const fetchStates = async () => {

    try {

      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          country: "India",
        }
      );

      setStates(res.data.data.states);

    } catch (error) {

      console.log(error);

    }

  };

  // ===========================
  // Fetch Cities
  // ===========================

  const fetchCities = async (state) => {
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          country: "India",
          state,
        }
      );

      const cityList = res.data.data || [];

      setCities(cityList);

      return cityList;

    } catch (error) {
      console.log(error);
      setCities([]);
      return [];
    }
  };

  // ===========================
  // Fetch User Profile
  // ===========================

  const fetchProfile = async () => {

    if (!token) return;

    try {

      const res = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = res.data.user;

      setFormData({
        fullName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });


      if (user.state) {
        await fetchCities(user.state);
      }

    } catch (error) {
      console.log(error);
    }

  };

  // ===========================
  // Fetch Active Coupons
  // ===========================
  const fetchActiveCoupons = async () => {
    try {
      setFetchingCoupons(true);
      const res = await axios.get("http://localhost:5000/api/coupon/active");
      if (res.data?.success && Array.isArray(res.data.coupons)) {
        setCouponsList(res.data.coupons);
      }
    } catch (err) {
      console.log("FETCH ACTIVE COUPONS ERROR:", err);
    } finally {
      setFetchingCoupons(false);
    }
  };

  // ===========================
  // Auto Fill & Init
  // ===========================
  useEffect(() => {
    fetchProfile();
    fetchStates();
    fetchActiveCoupons();
  }, []);

  // Apply Coupon by code string
  const applyCouponWithCode = async (codeToApply) => {
    const code = (codeToApply !== undefined ? codeToApply : couponCode || "").trim().toUpperCase();

    if (!code) {
      toast.error("Please select or enter a coupon code");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/coupon/apply",
        {
          code,
          totalAmount: grandTotal,
          cartTotal: grandTotal,
        }
      );

      setCouponCode(code);
      setDiscount(data.discountAmount);
      setFinalAmount(data.finalAmount);
      setCouponMessage(data.message || `Coupon ${code} applied successfully!`);
      const matched = couponsList.find((c) => c.code === code);
      setAppliedCoupon(data.coupon || matched || { code, discount: data.discountAmount });
      toast.success(`Coupon ${code} applied! Saved ₹${data.discountAmount.toLocaleString("en-IN")}`);
    } catch (error) {
      setDiscount(0);
      setFinalAmount(grandTotal);
      setCouponMessage("");
      setAppliedCoupon(null);
      toast.error(
        error.response?.data?.message || "Invalid or inapplicable coupon"
      );
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setFinalAmount(grandTotal);
    setCouponMessage("");
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

    const handlePayment = async (e) => {
      e.preventDefault();

      const allTouched = {
        fullName: true,
        phone: true,
        email: true,
        address: true,
        state: true,
        city: true,
        pincode: true,
      };
      setTouched(allTouched);

      const validationErrors = validateForm();
      const errorKeys = Object.keys(validationErrors);

      if (errorKeys.length > 0) {
        const firstError = validationErrors[errorKeys[0]];
        toast.error(firstError || "Please fill in all shipping details correctly.");
        return;
      }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to continue with checkout.");
      return;
    }

    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Razorpay SDK Failed To Load");
      return;
    }

    try {

      setLoading(true);

      const { data } = await axios.post(

        "http://localhost:5000/api/payment/create-order",

        {
          amount: finalAmount,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      const options = {

        key: data.key,

        amount: data.amount,
        currency: data.currency,
        order_id: data.id,

        name: "Modern Interiors",

        description: "Furniture Purchase",

        handler: async function (response) {

          try {

            await axios.post(

              "http://localhost:5000/api/orders",

              {

                ...formData,
                coupon: couponCode || "",
                discount,
                totalPrice: finalAmount,

                payment: {

                  paymentId: response.razorpay_payment_id,

                  razorpayOrderId: response.razorpay_order_id,

                  razorpaySignature: response.razorpay_signature,

                },

              },

              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }

            );

            toast.success("Payment Successful 🎉");

            fetchCart();

            setTimeout(() => {

              navigate("/payment-success", {
                state: {
                  order: {
                    customerName: formData.fullName,
                    items: cart,
                    subtotal: totalPrice,
                    discount,
                    delivery: deliveryCharge,
                    total: finalAmount,
                    paymentId: response.razorpay_payment_id,
                    date: new Date().toLocaleDateString(),
                  },
                },
              });

            }, 1200);
          }

          catch (err) {

            console.log(err);

            toast.error("Order Saving Failed");

          }

        },

        prefill: {

          name: formData.fullName,

          email: formData.email,

          contact: formData.phone,

        },

        theme: {

          color: "#D4AF37",

        },

      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();

    }

    catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Payment Failed"
      );

    }

    finally {

      setLoading(false);

    }

  };

  // ===========================
  // Empty Cart
  // ===========================

  if (cart.length === 0) {

    return (

      <section className="checkout-page">

        <div className="empty-cart">

          <h2>Your Cart Is Empty</h2>

          <p>Please add furniture before checkout.</p>

        </div>

      </section>

    );

  }

  // ===========================
  // JSX
  // ===========================

  return (

    <section className="checkout-page">

      <h1 className="checkout-title">
        Checkout
      </h1>

      <div className="checkout-container">

        {/* LEFT SIDE */}        <form
          id="checkoutForm"
          className="checkout-form"
          noValidate
          onSubmit={handlePayment}
        >

          <h2>Shipping Details</h2>

          <div className="form-group">

            <label>Full Name *</label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Full Name (e.g. John Doe)"
              className={
                errors.fullName && touched.fullName
                  ? "input-error"
                  : touched.fullName && !errors.fullName
                  ? "input-valid"
                  : ""
              }
            />

            {errors.fullName && touched.fullName && (
              <div className="error-message">
                <FaExclamationCircle />
                <span>{errors.fullName}</span>
              </div>
            )}

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>Phone Number *</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={10}
                placeholder="10-Digit Mobile Number (e.g. 9876543210)"
                className={
                  errors.phone && touched.phone
                    ? "input-error"
                    : touched.phone && !errors.phone
                    ? "input-valid"
                    : ""
                }
              />

              {errors.phone && touched.phone && (
                <div className="error-message">
                  <FaExclamationCircle />
                  <span>{errors.phone}</span>
                </div>
              )}

            </div>

            <div className="form-group">

              <label>Email Address *</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="example@gmail.com"
                className={
                  errors.email && touched.email
                    ? "input-error"
                    : touched.email && !errors.email
                    ? "input-valid"
                    : ""
                }
              />

              {errors.email && touched.email && (
                <div className="error-message">
                  <FaExclamationCircle />
                  <span>{errors.email}</span>
                </div>
              )}

            </div>

          </div>

          <div className="form-group">

            <label>Delivery Address *</label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="House/Flat No., Building Name, Street, Area"
              className={
                errors.address && touched.address
                  ? "input-error"
                  : touched.address && !errors.address
                  ? "input-valid"
                  : ""
              }
            />

            {errors.address && touched.address && (
              <div className="error-message">
                <FaExclamationCircle />
                <span>{errors.address}</span>
              </div>
            )}

          </div>

            <div className="form-row">

            {/* State */}

            <div className="form-group">

              <label>State *</label>

              <Select
                styles={getSelectStyles(errors.state && touched.state)}
                options={stateOptions}
                value={
                  stateOptions.find(
                    (option) => option.value === formData.state
                  ) || null
                }
                onChange={async (selected) => {

                  const value = selected ? selected.value : "";

                  const updated = {
                    ...formData,
                    state: value,
                    city: "",
                  };

                  setFormData(updated);

                  setTouched((prev) => ({
                    ...prev,
                    state: true,
                  }));

                  const stateErr = validateField("state", value, updated);

                  setErrors((prev) => ({
                    ...prev,
                    state: stateErr,
                    city: "",
                  }));

                  setCities([]);

                  if (value) {
                    await fetchCities(value);
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, state: true }));
                  const err = validateField("state", formData.state, formData);
                  setErrors((prev) => ({ ...prev, state: err }));
                }}
                placeholder="Search State..."
                isClearable
              />

              {errors.state && touched.state && (
                <div className="error-message">
                  <FaExclamationCircle />
                  <span>{errors.state}</span>
                </div>
              )}

            </div>

            {/* City */}

            <div className="form-group">

              <label>City *</label>

              <Select
                styles={getSelectStyles(errors.city && touched.city)}
                options={cityOptions}
                value={
                  cityOptions.find(
                    (option) => option.value === formData.city
                  ) || null
                }
                onChange={(selected) => {

                  const value = selected ? selected.value : "";

                  const updated = {
                    ...formData,
                    city: value,
                  };

                  setFormData(updated);

                  setTouched((prev) => ({
                    ...prev,
                    city: true,
                  }));

                  const cityErr = validateField("city", value, updated);

                  setErrors((prev) => ({
                    ...prev,
                    city: cityErr,
                  }));
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, city: true }));
                  const err = validateField("city", formData.city, formData);
                  setErrors((prev) => ({ ...prev, city: err }));
                }}
                placeholder={
                  formData.state
                    ? "Search City..."
                    : "Select State First"
                }
                isDisabled={!formData.state}
                isClearable
              />

              {errors.city && touched.city && (
                <div className="error-message">
                  <FaExclamationCircle />
                  <span>{errors.city}</span>
                </div>
              )}

            </div>

          </div>

          <div className="form-group">

            <label>Pincode *</label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={6}
              placeholder="6-Digit Pincode (e.g. 380001)"
              className={
                errors.pincode && touched.pincode
                  ? "input-error"
                  : touched.pincode && !errors.pincode
                  ? "input-valid"
                  : ""
              }
            />

            {errors.pincode && touched.pincode && (
              <div className="error-message">
                <FaExclamationCircle />
                <span>{errors.pincode}</span>
              </div>
            )}

          </div>

        </form>

        {/* RIGHT SIDE */}

        <div className="summary-card">

          <h2>Order Summary</h2>

          <div className="summary-item">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="summary-item">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>

          {/* =========================================
              COUPON DROPDOWN / SELECTOR SECTION
          ========================================== */}
          <div className="checkout-coupon-section">
            <div className="checkout-coupon-header">
              <label className="checkout-coupon-label">
                <FaTag className="coupon-label-icon" />
                <span>Apply Coupon</span>
                {applicableCoupons.length > 0 && !appliedCoupon && (
                  <span className="coupon-badge-count">
                    {applicableCoupons.length} Available
                  </span>
                )}
              </label>

              {!appliedCoupon && (
                <button
                  type="button"
                  className="coupon-toggle-mode-btn"
                  onClick={() => setManualCodeMode(!manualCodeMode)}
                >
                  {manualCodeMode ? "Select from list" : "Enter custom code"}
                </button>
              )}
            </div>

            {/* APPLIED COUPON BADGE */}
            {appliedCoupon && discount > 0 ? (
              <div className="applied-coupon-card">
                <div className="applied-coupon-info">
                  <div className="applied-coupon-badge">
                    <FaCheckCircle />
                    <strong>{couponCode}</strong>
                  </div>
                  <span className="applied-coupon-savings">
                    {appliedCoupon.discount ? `${appliedCoupon.discount}% OFF` : "Discount"} applied! (You save ₹{discount.toLocaleString("en-IN")})
                  </span>
                </div>
                <button
                  type="button"
                  className="remove-coupon-btn"
                  onClick={removeCoupon}
                  title="Remove this coupon"
                >
                  <FaTimes />
                  <span>Remove</span>
                </button>
              </div>
            ) : manualCodeMode ? (
              /* MANUAL INPUT BOX */
              <div className="coupon-box">
                <input
                  type="text"
                  placeholder="Enter Coupon Code (e.g. MODERN20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCouponWithCode(couponCode);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => applyCouponWithCode(couponCode)}
                >
                  Apply
                </button>
              </div>
            ) : (
              /* ACTIVE COUPONS DROPDOWN */
              <div className="coupon-dropdown-box">
                <select
                  className="checkout-coupon-dropdown"
                  value={couponCode}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected) {
                      setCouponCode(selected);
                      applyCouponWithCode(selected);
                    } else {
                      removeCoupon();
                    }
                  }}
                >
                  <option value="">
                    {fetchingCoupons
                      ? "Loading available coupons..."
                      : applicableCoupons.length > 0
                      ? `-- Select an Active Coupon (${applicableCoupons.length} Available) --`
                      : "-- No Applicable Coupons for this Cart Value --"}
                  </option>

                  {applicableCoupons.length > 0 && (
                    <optgroup label="✨ Applicable Coupons (Ready to Apply)">
                      {applicableCoupons.map((c) => {
                        const estimatedSavings = Math.round((grandTotal * c.discount) / 100);
                        return (
                          <option key={c._id || c.code} value={c.code}>
                            🏷️ {c.code} — {c.discount}% OFF (Save ₹{estimatedSavings.toLocaleString("en-IN")}) {c.minAmount > 0 ? `[Min: ₹${c.minAmount.toLocaleString("en-IN")}]` : "[No Min Order]"}
                          </option>
                        );
                      })}
                    </optgroup>
                  )}

                  {lockedCoupons.length > 0 && (
                    <optgroup label="🔒 Locked Coupons (Cart Value Below Minimum)">
                      {lockedCoupons.map((c) => {
                        const needed = c.minAmount - grandTotal;
                        return (
                          <option key={c._id || c.code} value={c.code} disabled>
                            🔒 {c.code} — {c.discount}% OFF (Requires Min ₹{c.minAmount.toLocaleString("en-IN")} — Add ₹{needed.toLocaleString("en-IN")} more)
                          </option>
                        );
                      })}
                    </optgroup>
                  )}
                </select>
              </div>
            )}

            {/* HELPER HINT WHEN CART IS BELOW MIN AMOUNT */}
            {!appliedCoupon && lockedCoupons.length > 0 && applicableCoupons.length === 0 && (
              <p className="coupon-hint-notice">
                💡 Tip: Add <strong>₹{(lockedCoupons[0].minAmount - grandTotal).toLocaleString("en-IN")}</strong> more to your cart to unlock coupon <strong>{lockedCoupons[0].code} ({lockedCoupons[0].discount}% OFF)</strong>!
              </p>
            )}

            {couponMessage && !appliedCoupon && (
              <p className="coupon-success">{couponMessage}</p>
            )}
          </div>

          {discount > 0 && (
            <div className="summary-item discount-item">
              <span>Discount ({appliedCoupon?.discount || ""}% OFF)</span>
              <span className="discount-amount">
                -₹{discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="summary-item">
            <span>Delivery</span>
            <span>
              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge}`}
            </span>
          </div>

          <div className="summary-total">
            <span>Grand Total</span>
            <span>₹{finalAmount.toLocaleString()}</span>
          </div>

          <button
            type="button"
            className="place-order-btn"
            onClick={handlePayment}
            disabled={loading}
          >

            {loading
              ? "Processing..."
              : "Pay with Razorpay"}

          </button>

        </div>

      </div>

    </section>

  );

}

export default Checkout;