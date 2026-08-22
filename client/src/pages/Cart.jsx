import React, {
  useEffect,
  useMemo,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaArrowLeft,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import imageMap from "../utils/imageMap";

import "../css/Cart.css";

function Cart() {

  const navigate = useNavigate();

  const {
    cart,
    fetchCart,
    removeFromCart,
  } = useCart();

  // ===========================
  // Load Cart
  // ===========================

  useEffect(() => {

    fetchCart();

  }, []);

  // ===========================
  // Update Quantity
  // ===========================

  const updateQuantity = async (
    cartId,
    quantity
  ) => {

    const token = localStorage.getItem("token");

    if (!token) return;

    if (quantity < 1) return;

    try {

      await axios.put(
        `http://localhost:5000/api/cart/${cartId}`,
        {
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();

    } catch (error) {

      console.log(error);

    }

  };

// ===========================
// Cart Total Items
// ===========================

const totalItems = useMemo(() => {

  return cart.reduce(

    (total, item) => total + item.quantity,

    0

  );

}, [cart]);

// ===========================
// Cart Total Price
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
    // ===========================
  // JSX
  // ===========================

  return (
    <section className="cart-page">

      <h1 className="cart-title">
        <FaShoppingBag /> My Cart
      </h1>

      {cart.length === 0 ? (

        <div className="empty-cart">

          <h2>Your Cart is Empty</h2>

          <p>
            Looks like you haven't added any furniture yet.
          </p>

          <Link
            to="/furniture"
            className="continue-btn"
          >
            <FaArrowLeft /> Continue Shopping
          </Link>

        </div>

      ) : (

        <div className="cart-container">

          {/* LEFT */}

          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-card"
                key={item._id}
              >

                <img
                  src={imageMap[item.furniture.image]}
                  alt={item.furniture.name}
                  className="cart-image"
                />

                <div className="cart-details">

                  <h2>{item.furniture.name}</h2>

                  <p className="category">
                    {item.furniture.category}
                  </p>

                  <p className="price">
                    ₹
                    {item.furniture.priceValue.toLocaleString()}
                  </p>

                </div>

                {/* Quantity */}

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.quantity - 1
                      )
                    }
                    disabled={item.quantity === 1}
                  >
                    <FaMinus />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.quantity + 1
                      )
                    }
                  >
                    <FaPlus />
                  </button>

                </div>

                {/* Total */}

                <div className="item-total">

                  ₹
                  {(
                    item.furniture.priceValue *
                    item.quantity
                  ).toLocaleString()}

                </div>

                {/* Remove */}

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  <FaTrash />
                </button>

              </div>

            ))}

          </div>

          {/* RIGHT */}

          <div className="summary-card">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>Total Items</span>

              <span>{totalItems}</span>

            </div>

            <div className="summary-row">

              <span>Total Price</span>

              <strong>
                ₹{totalPrice.toLocaleString()}
              </strong>

            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed To Checkout
            </button>

            <Link
              to="/furniture"
              className="continue-btn"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      )}

    </section>
  );

}

export default Cart;