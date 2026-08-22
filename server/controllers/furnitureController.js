const Furniture = require("../models/Furniture");

// ===========================
// GET ALL FURNITURE
// ===========================

const getAllFurniture = async (req, res) => {

  try {

    const furniture = await Furniture.find();

    res.status(200).json({
      success: true,
      count: furniture.length,
      furniture,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===========================
// GET SINGLE FURNITURE
// ===========================

const getFurnitureById = async (req, res) => {

  try {

    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({
        success: false,
        message: "Furniture not found",
      });
    }

    res.status(200).json({
      success: true,
      furniture,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getAllFurniture,
  getFurnitureById,
};