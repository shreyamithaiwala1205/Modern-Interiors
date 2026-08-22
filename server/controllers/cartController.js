const Cart = require("../models/Cart");

// ===================================
// Add To Cart
// ===================================

const addToCart = async (req, res) => {
  try {
    const { furnitureId } = req.body;

    const userId = req.user._id;

    // Check if already exists
    const existingCart = await Cart.findOne({
      user: userId,
      furniture: furnitureId,
    });

    if (existingCart) {
      existingCart.quantity += 1;

      await existingCart.save();

      return res.status(200).json({
        success: true,
        message: "Quantity Updated",
        cart: existingCart,
      });
    }

    // Create new cart item
    const cart = await Cart.create({
      user: userId,
      furniture: furnitureId,
      quantity: 1,
    });

    res.status(201).json({
      success: true,
      message: "Product Added To Cart",
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Get Cart
// ===================================

const getCart = async (req, res) => {

  try {

    const cart = await Cart.find({
      user: req.user._id,
    }).populate("furniture");

    const totalPrice = cart.reduce((total, item) => {

      return total + (item.furniture.priceValue * item.quantity);

    }, 0);

    res.status(200).json({
      success: true,
      count: cart.length,
      totalPrice,
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===================================
// Update Quantity
// ===================================

const updateCartQuantity = async (req, res) => {

  try {

    const { quantity } = req.body;

    // Quantity validation
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Item Not Found",
      });
    }

    cart.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity Updated Successfully",
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===================================
// Remove Cart Item
// ===================================

const removeFromCart = async (req, res) => {

  try {

    const cart = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Item Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Removed From Cart",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
};