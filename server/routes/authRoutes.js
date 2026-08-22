const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ===============================
// Register
// POST /api/auth/register
// ===============================

router.post(
  "/register",
  registerUser
);

// ===============================
// Login
// POST /api/auth/login
// ===============================

router.post(
  "/login",
  loginUser
);

// ===============================
// Get Logged In User Profile
// GET /api/auth/profile
// ===============================

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/change-password",
  protect,
  changePassword
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/reset-password",
  resetPassword
);

// ===============================
// Update User Profile
// PUT /api/auth/profile
// ===============================

router.put(
  "/profile",
  protect,
  updateProfile
);

module.exports = router;