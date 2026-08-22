const Order = require("../models/Order");
const Cart = require("../models/Cart");

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

    const totalPrice = subtotal + deliveryCharge;

      const order = await Order.create({

    user: req.user._id,

    orderNumber: "ORD" + Date.now(),

    items: cartItems.map((item) => ({
      furniture: item.furniture._id,
      quantity: item.quantity,
      price: item.furniture.priceValue,
    })),

    totalItems,
    subtotal,
    deliveryCharge,
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


      // Clear Cart after order
      await Cart.deleteMany({
        user: req.user._id,
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