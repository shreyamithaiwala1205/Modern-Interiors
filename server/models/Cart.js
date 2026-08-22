const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    furniture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Furniture",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);
cartSchema.index(
  {
    user: 1,
    furniture: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);