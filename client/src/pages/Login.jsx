import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import "../css/Login.css";

function Login({ changeForm }) {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ===========================
  // Handle Input Change
  // ===========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // Login
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Save JWT Token
      login(response.data.user, response.data.token);

      toast.success("Login Successful 🎉");

      setFormData({
        email: "",
        password: "",
      });

      setTimeout(() => {
            if (response.data.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
          }, 1000);

          } catch (error) {
            toast.error(
              error.response?.data?.message || "Login Failed"
            );
          } finally {
            setLoading(false);
          }
        };

    return (
    <section className="login-page">
      <div className="login-box">

        <h4>Welcome Back</h4>

        <h1>Login</h1>

        <p>
          Login to continue exploring Modern Interiors.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <div className="input-box">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Password */}

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="eye"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>

          </div>

          <div className="forgot-link">
              <Link to="/forgot-password">
              Forgot Password?
              </Link>
          </div>


          {/* Options */}

          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember Me
            </label>

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

        <div className="bottom-text">

          Don't have an account?

          <span
            className="switch-link"
            onClick={changeForm}
          >
            Register
          </span>

        </div>

      </div>
    </section>
  );
}

export default Login;