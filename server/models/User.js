const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===========================
    // Basic Details
    // ===========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    otp: {
      type: String,
      default: "",
    },

    otpExpire: {
      type: Date,
    },
    // ===========================
    // Profile Details
    // ===========================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
      trim: true,
    },

    // ===========================
    // Wishlist
    // ===========================

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Furniture",
      },
    ],

    // ===========================
    // Cart
    // ===========================

    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Furniture",
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    // ===========================
    // Orders
    // ===========================

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);