const Project = require("../models/Project");
const User = require("../models/User");
const Order = require("../models/Order");
const Consultation = require("../models/Consultation");

// =======================================
// Get Website Stats
// =======================================

const getStats = async (req, res) => {

  try {

    const projects = await Project.countDocuments();

    const users = await User.countDocuments();

    const orders = await Order.countDocuments();

    const consultations = await Consultation.countDocuments();

    res.status(200).json({

      success: true,

      stats: {

        projects,

        users,

        orders,

        consultations,

      },

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

module.exports = {
  getStats,
};