import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { getFriendlyErrorMessage } from "../../utils/errorHandler";
import { useAuth } from "../../context/AuthContext";

import "../css/Admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      toast.error("Please enter both your admin email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Admin login failed.");
        return;
      }

      // Only Admin Can Login
      if (res.data.user.role !== "admin") {
        toast.error("Access Denied! Administrator privileges required.");
        return;
      }

      // Sync auth state with global AuthContext
      login(res.data.user, res.data.token);

      const adminName = res.data.user?.name
        ? res.data.user.name.split(" ")[0]
        : "Admin";

      toast.success(`Welcome back, ${adminName}! Admin login successful.`);

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 500);
    } catch (error) {
      const errorMsg = getFriendlyErrorMessage(
        error,
        "Invalid administrator credentials. Please check your details and try again."
      );
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;