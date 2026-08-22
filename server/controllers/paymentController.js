const razorpay = require("../config/razorpay");

// =====================================
// Create Razorpay Order
// =====================================

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: Number(amount) * 100, // Convert ₹ to Paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {

    console.error("❌ Razorpay Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay Order",
    });

  }
};

module.exports = {
  createOrder,
};