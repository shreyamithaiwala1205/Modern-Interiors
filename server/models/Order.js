const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ===========================
    // User
    // ===========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===========================
    // Order Number
    // ===========================

    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // ===========================
    // Ordered Items
    // ===========================

    items: [
      {
        furniture: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Furniture",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    // ===========================
    // Pricing
    // ===========================

    totalItems: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    // ===========================
    // Shipping Address
    // ===========================

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ===========================
    // Payment
    // ===========================

    payment: {
      paymentId: {
        type: String,
      },

      razorpayOrderId: {
        type: String,
      },

      razorpaySignature: {
        type: String,
      },

      method: {
        type: String,
        enum: ["Razorpay", "COD"],
        default: "Razorpay",
      },

      amount: {
        type: Number,
      },

      currency: {
        type: String,
        default: "INR",
      },

      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },

      paidAt: {
        type: Date,
      },
    },

    // ===========================
    // Delivery
    // ===========================

    estimatedDelivery: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    // ===========================
    // Order Status
    // ===========================

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Order", orderSchema);