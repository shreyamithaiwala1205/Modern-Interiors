import React, {
  useState,
  useMemo,
  useEffect,
} from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

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

  const token = localStorage.getItem("token");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#222",
      opacity: state.isDisabled ? 0.7 : 1,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      borderColor: state.isFocused ? "#D4AF37" : "#444",
      borderRadius: "10px",
      minHeight: "48px",
      boxShadow: "none",
      color: "#fff",
      "&:hover": {
        borderColor: "#D4AF37",
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
      color: "#888",
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: "#222",
      border: "1px solid #444",
      borderRadius: "10px",
    }),

    input: (provided) => ({
      ...provided,
      color: "#fff",
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
      color: "#D4AF37",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    clearIndicator: (provided) => ({
      ...provided,
      color: "#D4AF37",
    }),
  };

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
  // Handle Input Change
  // ===========================

 const handleChange = async (e) => {
  const { name, value } = e.target;

    if (name === "state") {

    setFormData((prev) => ({
      ...prev,
      state: value,
      city: "",
    }));

    setErrors((prev) => ({
      ...prev,
      state: "",
      city: "",
    }));

    setCities([]);

    await fetchCities(value);

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

  const validateForm = () => {

  let newErrors = {};

  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full Name is required";
  }

  if (!/^[6-9]\d{9}$/.test(formData.phone)) {
    newErrors.phone = "Enter valid mobile number";
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    newErrors.email = "Enter valid email";
  }

  if (!formData.address.trim()) {
    newErrors.address = "Address is required";
  }

  if (!formData.city.trim()) {
    newErrors.city = "Select City";
  }

  if (!formData.state.trim()) {
    newErrors.state = "Select State";
  }

  if (!/^\d{6}$/.test(formData.pincode)) {
    newErrors.pincode = "Enter valid pincode";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
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

  useEffect(() => {

    setFinalAmount(grandTotal);

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
  // Auto Fill
  // ===========================

  useEffect(() => {

    fetchProfile();

    fetchStates();

  }, []);

    const applyCoupon = async () => {

      if (!couponCode.trim()) {

        toast.error("Enter Coupon Code");

        return;

      }

      try {

        const { data } = await axios.post(

          "http://localhost:5000/api/coupon/apply",

          {

            code: couponCode,

            totalAmount: grandTotal,

          }

        );

        setDiscount(data.discountAmount);

        setFinalAmount(data.finalAmount);

        setCouponMessage(data.message);

        toast.success(data.message);

      }

      catch (error) {

        setDiscount(0);

        setFinalAmount(grandTotal);

        setCouponMessage("");

        toast.error(

          error.response?.data?.message ||

          "Invalid Coupon"

        );

      }

    };

    const handlePayment = async (e) => {

      e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please Login First");
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

        {/* LEFT SIDE */}

        <form
          id="checkoutForm"
          className="checkout-form"
        >

          <h2>Shipping Details</h2>

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter Full Name"
              required
            />

            {errors.fullName && (
              <small className="error-text">
                {errors.fullName}
              </small>
            )}

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />

              {errors.phone && (
                <small className="error-text">
                  {errors.phone}
                </small>
              )}

            </div>

            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
              />

              {errors.email && (
                <small className="error-text">
                  {errors.email}
                </small>
              )}

            </div>

          </div>

          <div className="form-group">

            <label>Address</label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, Area"
              required
            />

            {errors.address && (
              <small className="error-text">
                {errors.address}
              </small>
            )}

          </div>

            <div className="form-row">

            {/* State */}

            <div className="form-group">

              <label>State</label>

              <Select
                styles={customSelectStyles}
                options={stateOptions}
                value={
                  stateOptions.find(
                    (option) => option.value === formData.state
                  ) || null
                }
                onChange={async (selected) => {

                  const value = selected ? selected.value : "";

                  setFormData((prev) => ({
                    ...prev,
                    state: value,
                    city: "",
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    state: "",
                    city: "",
                  }));

                  setCities([]);

                  if (value) {
                    await fetchCities(value);
                  }
                }}
                placeholder="Search State..."
                isClearable
              />

              {errors.state && (
                <small className="error-text">
                  {errors.state}
                </small>
              )}

            </div>

            {/* City */}

            <div className="form-group">

              <label>City</label>

              <Select
                styles={customSelectStyles}
                options={cityOptions}
                value={
                  cityOptions.find(
                    (option) => option.value === formData.city
                  ) || null
                }
                onChange={(selected) => {

                  setFormData((prev) => ({
                    ...prev,
                    city: selected ? selected.value : "",
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    city: "",
                  }));
                }}
                placeholder={
                  formData.state
                    ? "Search City..."
                    : "Select State First"
                }
                isDisabled={!formData.state}
                isClearable
              />

              {errors.city && (
                <small className="error-text">
                  {errors.city}
                </small>
              )}

            </div>

          </div>

          <div className="form-group">

            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="380001"
              required
            />

            {errors.pincode && (
              <small className="error-text">
                {errors.pincode}
              </small>
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

          <div className="coupon-box">

            <input

              type="text"

              placeholder="Enter Coupon"

              value={couponCode}

              onChange={(e)=>setCouponCode(e.target.value.toUpperCase())}

            />

            <button onClick={applyCoupon}>

              Apply

            </button>

          </div>

          {couponMessage && (

          <p className="coupon-success">

            {couponMessage}

          </p>

          )}

          {discount > 0 && (

          <div className="summary-item">

            <span>Discount</span>

            <span style={{color:"#4CAF50"}}>

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