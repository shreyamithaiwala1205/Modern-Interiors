const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Furniture = require("../models/Furniture");
const { applyStockVisibility } = require("../utils/stockVisibility");

const {
  sendBrevoEmail,
} = require("../config/brevoMailer");

const {
  orderConfirmationEmail,
} = require("../config/emailTemplates");

// ===================================
// Place Order
// ===================================

const placeOrder = async (req, res) => {

  try {

    const {
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      payment,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all shipping details",
      });
    }

    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate("furniture");


    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Products deleted, or hidden/disabled by admin, after being
    // added to cart can't be purchased.
    const unavailableItems = cartItems.filter(
      (item) => !item.furniture || item.furniture.isVisible === false
    );

    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Some items in your cart are no longer available: ${unavailableItems
          .map((item) => item.furniture?.name || "Unknown item")
          .join(", ")}. Please remove them and try again.`,
      });
    }

    // Make sure requested quantities are still in stock.
    const outOfStockItems = cartItems.filter(
      (item) => item.furniture.stock < item.quantity
    );

    if (outOfStockItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for: ${outOfStockItems
          .map((item) => item.furniture.name)
          .join(", ")}`,
      });
    }

    const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
    );

    const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + item.furniture.priceValue * item.quantity,
    0
    );

    const deliveryCharge = subtotal > 5000 ? 0 : 499;

    const discount = Number(req.body.discount) || 0;
    const coupon = String(req.body.coupon || "").trim();

    const clientTotalPrice = Number(req.body.totalPrice);
    const calculatedTotal = Math.max(subtotal + deliveryCharge - discount, 0);
    const totalPrice = Number.isFinite(clientTotalPrice) && clientTotalPrice >= 0 ? clientTotalPrice : calculatedTotal;

    const order = await Order.create({

      user: req.user._id,

      orderNumber: "ORD" + Date.now(),

      items: cartItems.map((item) => ({
        furniture: item.furniture._id,
        name: item.furniture.name,
        image: item.furniture.image,
        quantity: item.quantity,
        price: item.furniture.priceValue,
      })),

      totalItems,
      subtotal,
      deliveryCharge,
      discount,
      coupon,
      totalPrice,

    shippingAddress: {
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    },

    payment: {

        paymentId: payment?.paymentId,

        razorpayOrderId: payment?.razorpayOrderId,

        razorpaySignature: payment?.razorpaySignature,

        method: payment?.method || "Razorpay",

        amount: totalPrice,

        currency: "INR",

        status: payment?.status || "Paid",

        paidAt: new Date(),

      },

    });


      // Deduct purchased quantities from stock and
      // auto-hide any product that just sold out.
      for (const item of cartItems) {

        const product = await Furniture.findById(
          item.furniture._id
        );

        if (!product) continue;

        product.stock = Math.max(
          product.stock - item.quantity,
          0
        );

        applyStockVisibility(product);

        await product.save();

      }


      // Clear Cart after order
      await Cart.deleteMany({
        user: req.user._id,
      });


      // Send order confirmation email to the
      // customer. Failures are logged inside
      // sendBrevoEmail and never block the order.
      const emailItems = cartItems.map((item) => ({
        name: item.furniture.name,
        quantity: item.quantity,
        price: item.furniture.priceValue,
      }));

      const { subject, html } =
        orderConfirmationEmail({
          order,
          items: emailItems,
        });

      sendBrevoEmail({
        toEmail: order.shippingAddress.email,
        toName: order.shippingAddress.fullName,
        subject,
        html,
      });


      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
      });


    } catch (error) {

      console.log("Place Order Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to place order",
        error: error.message,
      });

    }

    };

// ===================================
// Get My Orders
// ===================================

const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.furniture")
      .sort({ createdAt: -1 });

    res.status(200).json({

      success: true,

      count: orders.length,

      orders,

    });

  } catch (error) {

    console.error("========== ORDER ERROR ==========");
    console.error(error);
    console.error(error.stack);
    console.error("================================");

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  placeOrder,
  getMyOrders,
};