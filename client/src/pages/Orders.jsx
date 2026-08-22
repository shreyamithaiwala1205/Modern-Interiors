import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import imageMap from "../utils/imageMap";
import SkeletonOrder from "../components/SkeletonOrder";

import "../css/Orders.css";


function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="orders-page">

        <h1 className="orders-title">
          My Orders
        </h1>

        <SkeletonOrder />
        <SkeletonOrder />
        <SkeletonOrder />

      </section>
    );
  }

  return (
    <section className="orders-page">

      <h1 className="orders-title">
        My Orders
      </h1>

      {orders.length === 0 ? (

        <div className="empty-orders">
          <h2>No Orders Yet</h2>
          <p>You haven't placed any order.</p>
        </div>

      ) : (

        orders.map((order) => {

          const address =
            order.shippingAddress || order.customerInfo || {};

          const estimatedDate = order.estimatedDelivery
            ? new Date(order.estimatedDelivery).toLocaleDateString()
            : "Will be updated";

          return (

            <div
              className="order-card"
              key={order._id}
            >

              {/* Header */}

              <div className="order-header">

                <div>

                  <h3>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>

                  <p className="order-date">
                    Placed On :
                    {" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

                <div className="status-wrapper">

                  <span className="payment-status">
                    Payment :
                    {" "}
                    {order.payment?.status}
                  </span>

                  <span className="delivery-status">
                    Order :
                    {" "}
                    {order.status}
                  </span>

                </div>

              </div>

              {/* Items */}

              {order.items.map((item) => (

                <div
                  className="order-item"
                  key={item._id}
                >

                  <img
                    src={imageMap[item.furniture.image]}
                    alt={item.furniture.name}
                  />

                  <div className="order-info">
                    <h4>{item.furniture.name}</h4>

                    <p>
                      Qty : {item.quantity}
                    </p>

                    <p>
                      ₹
                      {item.price
                        ? item.price.toLocaleString()
                        : item.furniture.priceValue.toLocaleString()}
                    </p>
                  </div>

                </div>

              ))}

              {/* Shipping */}

              <div className="shipping-box">

                <h4>Shipping Address</h4>

                <p>{address.fullName}</p>

                <p>{address.address}</p>

                <p>
                  {address.city},
                  {" "}
                  {address.state}
                  {" "}
                  -
                  {" "}
                  {address.pincode}
                </p>

                <p>
                  Phone :
                  {" "}
                  {address.phone}
                </p>

              </div>

              {/* Payment */}

              <div className="payment-box">

                <p>

                  <strong>
                    Payment Method :
                  </strong>

                  {" "}
                  {order.payment?.method}

                </p>

                <p>

                  <strong>
                    Estimated Delivery :
                  </strong>

                  {" "}
                  {estimatedDate}

                </p>

              </div>

              {/* Timeline */}

              <div className="timeline">

                <div className={`step active`}>
                  <div className="circle">✓</div>
                  <p>Order Placed</p>
                </div>

                <div className={`line active`}></div>

                <div
                  className={`step ${
                    order.payment?.status === "Paid"
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="circle">✓</div>
                  <p>Payment</p>
                </div>

                <div
                  className={`line ${
                    order.status !== "Pending"
                      ? "active"
                      : ""
                  }`}
                ></div>

                <div
                  className={`step ${
                    order.status === "Processing" ||
                    order.status === "Shipped" ||
                    order.status === "Delivered"
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="circle">✓</div>
                  <p>Processing</p>
                </div>

                <div
                  className={`line ${
                    order.status === "Shipped" ||
                    order.status === "Delivered"
                      ? "active"
                      : ""
                  }`}
                ></div>

                <div
                  className={`step ${
                    order.status === "Shipped" ||
                    order.status === "Delivered"
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="circle">✓</div>
                  <p>Shipped</p>
                </div>

                <div
                  className={`line ${
                    order.status === "Delivered"
                      ? "active"
                      : ""
                  }`}
                ></div>

                <div
                  className={`step ${
                    order.status === "Delivered"
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="circle">✓</div>
                  <p>Delivered</p>
                </div>

              </div>

              {/* Footer */}

              <div className="order-footer">

                <strong>

                  Total :
                  {" "}
                  ₹
                  {order.totalPrice.toLocaleString()}

                </strong>

                <div className="order-buttons">

                  {/* <button
                    className="details-btn"
                    onClick={() =>
                      navigate(`/orders/${order._id}`)
                    }
                  >
                    View Details
                  </button> */}

                  <button
                    className="shop-btn"
                    onClick={() =>
                      navigate("/furniture")
                    }
                  >
                    Continue Shopping
                  </button>

                </div>

              </div>

            </div>

          );

        })

      )}

    </section>
  );
}

export default Orders;