const Wishlist = require("../models/Wishlist");

// ===================================
// Add To Wishlist
// ===================================

const addToWishlist = async (req, res) => {
  try {
    const { furnitureId } = req.body;

    const userId = req.user._id;

    // Already Exists?

    const alreadyExists = await Wishlist.findOne({
      user: userId,
      furniture: furnitureId,
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: userId,
      furniture: furnitureId,
    });

    res.status(201).json({
      success: true,
      message: "Added to Wishlist Successfully",
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Get Wishlist
// ===================================

const getWishlist = async (req, res) => {

  try {

    const userId = req.user._id;

    const wishlist = await Wishlist.find({
      user: userId,
    }).populate("furniture");

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===================================
// Remove From Wishlist
// ===================================

const removeFromWishlist = async (req, res) => {

  try {

    const { id } = req.params;

    await Wishlist.findOneAndDelete({
    _id: id,
    user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Removed from Wishlist",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};