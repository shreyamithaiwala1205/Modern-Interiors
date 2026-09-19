const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const transporter = require("../config/sendEmail");
const User = require("../models/User");

// ==========================================
// Error Sanitizer Helper
// ==========================================
const handleAuthError = (
  res,
  error,
  defaultMessage = "Service temporarily unavailable. Please try again later."
) => {
  console.error("AUTH_ERROR:", error);

  const errMsg = error?.message || "";
  const isDbOrNetwork =
    errMsg.includes("ENOTFOUND") ||
    errMsg.includes("ECONNREFUSED") ||
    errMsg.includes("ETIMEDOUT") ||
    errMsg.includes("Mongo") ||
    errMsg.includes("Mongoose") ||
    errMsg.includes("buffering") ||
    errMsg.includes("timed out") ||
    errMsg.includes("Topology") ||
    errMsg.includes("getaddrinfo");

  if (isDbOrNetwork) {
    return res.status(500).json({
      success: false,
      message: "Database service temporarily unavailable. Please try again in a few moments.",
    });
  }

  return res.status(500).json({
    success: false,
    message: defaultMessage,
  });
};

// ==========================================
// Register User
// ==========================================

const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
    });

  } catch (error) {
    return handleAuthError(
      res,
      error,
      "Unable to complete registration. Please try again later."
    );
  }
};

// ==========================================
// Login User
// ==========================================

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
    });

  } catch (error) {
    return handleAuthError(
      res,
      error,
      "Unable to sign in right now. Please try again later."
    );
  }

};
// ==========================================
// Get Logged In User Profile
// ==========================================

const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return handleAuthError(
      res,
      error,
      "Unable to retrieve user profile."
    );
  }

};

const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: `"Modern Interiors" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Modern Interiors Password Reset OTP",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Modern Interiors Password Reset</title>
      </head>

      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;background:#f5f5f5;">
      <tr>
      <td align="center">

      <table width="600" cellpadding="0" cellspacing="0"
      style="
      max-width:600px;
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      box-shadow:0 12px 35px rgba(0,0,0,.15);
      ">

      <!-- HEADER -->

      <tr>
      <td
      style="
      background:linear-gradient(135deg,#111111,#1f1f1f);
      padding:45px 30px;
      text-align:center;
      ">

      <h1
      style="
      margin:0;
      font-size:34px;
      color:#D4AF37;
      font-weight:bold;
      letter-spacing:1px;
      ">
      Modern Interiors
      </h1>

      <p
      style="
      margin:10px 0 0;
      color:#dddddd;
      font-size:15px;
      ">
      Luxury Furniture & Interior Design
      </p>

      </td>
      </tr>

      <!-- BODY -->

      <tr>
      <td style="padding:45px;">

      <p
      style="
      margin:0;
      font-size:18px;
      color:#333;
      ">
      Hi <strong>${user.name}</strong>,
      </p>

      <p
      style="
      margin:25px 0;
      font-size:16px;
      line-height:1.8;
      color:#555;
      ">
      We received a request to reset the password for your
      <strong>Modern Interiors</strong> account.
      </p>

      <p
      style="
      font-size:16px;
      color:#555;
      margin-bottom:25px;
      ">
      Use the verification code below to continue:
      </p>

      <!-- OTP BOX -->

      <table
      align="center"
      cellpadding="0"
      cellspacing="0"
      style="
      margin:30px auto;
      border:2px solid #D4AF37;
      border-radius:12px;
      background:#111111;
      ">

      <tr>

      <td
      style="
      padding:20px 45px;
      font-size:38px;
      font-weight:bold;
      letter-spacing:10px;
      color:#D4AF37;
      text-align:center;
      ">
      ${otp}
      </td>

      </tr>

      </table>

      <!-- VALIDITY -->

      <div
      style="
      margin:35px 0;
      padding:18px;
      background:#FFF8E7;
      border-left:5px solid #D4AF37;
      border-radius:10px;
      ">

      <p
      style="
      margin:0;
      font-size:15px;
      color:#444;
      ">

      <b>OTP Validity:</b>

      This verification code will expire in
      <b>5 minutes</b>.

      </p>

      </div>

      <!-- SECURITY -->

      <div
      style="
      padding:22px;
      background:#fafafa;
      border:1px solid #e5e5e5;
      border-radius:12px;
      ">

      <h3
      style="
      margin:0 0 15px;
      font-size:18px;
      color:#111;
      ">
      Security Tips
      </h3>

      <ul
      style="
      margin:0;
      padding-left:20px;
      color:#555;
      line-height:1.9;
      font-size:15px;
      ">

      <li>Never share this OTP with anyone.</li>

      <li>Modern Interiors will never ask for your OTP.</li>

      <li>If you didn't request this reset, simply ignore this email.</li>

      </ul>

      </div>

      <p
      style="
      margin-top:35px;
      font-size:15px;
      color:#555;
      line-height:1.8;
      ">

      Need help?

      <br><br>

      <a
      href="mailto:moderninteriors2627@gmail.com"
      style="
      color:#D4AF37;
      text-decoration:none;
      font-weight:bold;
      ">

      moderninteriors2627@gmail.com

      </a>

      </p>

      <p
      style="
      margin-top:35px;
      font-size:15px;
      color:#555;
      ">

      Regards,

      <br>

      <b>Modern Interiors Team</b>

      </p>

      </td>
      </tr>

      <!-- FOOTER -->

      <tr>

      <td
      style="
      background:#111111;
      padding:28px;
      text-align:center;
      ">

      <p
      style="
      margin:0;
      font-size:14px;
      color:#cccccc;
      ">

      © ${new Date().getFullYear()} Modern Interiors

      </p>

      <p
      style="
      margin-top:8px;
      font-size:13px;
      color:#999999;
      ">

      Luxury Furniture • Interior Design • Premium Experience

      </p>

      </td>

      </tr>

      </table>

      </td>
      </tr>
      </table>

      </body>
      </html>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return handleAuthError(
      res,
      error,
      "Unable to send reset verification code. Please try again later."
    );
  }

};

// ==========================================
// Verify OTP
// ==========================================

const verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
    });

  }

  catch (error) {
    return handleAuthError(
      res,
      error,
      "Unable to verify code. Please try again."
    );
  }

};

// ==========================================
// Reset Password
// ==========================================

const resetPassword = async (req, res) => {

  try {

    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.otp !== otp ||
      !user.otpExpire ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.otp = "";
    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });

  } catch (error) {
    return handleAuthError(
      res,
      error,
      "Unable to reset password. Please try again later."
    );
  }

};

// ==========================================
// Change Password
// ==========================================

const changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current Password is incorrect",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.json({
      success: true,
      message: "Password Changed Successfully",
    });

  }

  catch (error) {
    return handleAuthError(
      res,
      error,
      "Unable to change password. Please try again."
    );
  }

};

// ==========================================
// Update User Profile
// ==========================================

const updateProfile = async (req, res) => {

  try {

    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.city = city ?? user.city;
    user.state = state ?? user.state;
    user.pincode = pincode ?? user.pincode;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
    });

  } catch (error) {
    return handleAuthError(
      res,
      error,
      "Unable to update profile. Please try again."
    );
  }

};

// ==========================================
// Exports
// ==========================================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword,
};