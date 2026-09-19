import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import { getFriendlyErrorMessage } from "../utils/errorHandler";
import "../css/ForgotPassword.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {

    e.preventDefault();

    if (!email || !email.trim()) {
      return toast.error("Please enter your registered email address.");
    }

    try {

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email: email.trim(),
        }
      );

      toast.success(data.message || "Verification code sent to your email.");

      navigate("/verify-otp", {
        state: { email: email.trim() },
      });

    }

    catch (error) {

      const errorMsg = getFriendlyErrorMessage(
        error,
        "Unable to send reset code. Please verify your email and try again."
      );
      toast.error(errorMsg);

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <section className="auth-wrapper">

    <div className="forgot-card">

    <h1>Forgot Password</h1>

    <p>Enter your registered email to receive OTP.</p>

    <form onSubmit={sendOTP}>
      <div className="input-box">
        <FaEnvelope className="input-icon" />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
      </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

    </form>
    <div className="back-login">
      <Link to="/account">
        ← Back to Login
      </Link>
    </div>
    
    </div>

    </section>

    );

}

export default ForgotPassword;