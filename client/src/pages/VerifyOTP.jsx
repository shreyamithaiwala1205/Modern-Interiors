import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaKey, FaClock } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../css/VerifyOTP.css";

function VerifyOTP() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {

    if (!email) {
      navigate("/forgot-password");
    }

  }, [email, navigate]);

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);

  const [expired, setExpired] = useState(false);

  // ==========================
  // Countdown Timer
  // ==========================

  useEffect(() => {

    if (expired) return;

    if (timeLeft <= 0) {

      setExpired(true);

      return;

    }

    const timer = setInterval(() => {

      setTimeLeft((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, expired]);

  // ==========================
  // Format Timer
  // ==========================

  const formatTime = () => {

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  };

  // ==========================
  // Verify OTP
  // ==========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (expired) {

      return toast.error("OTP Expired. Please resend OTP.");

    }

    if (!otp) {

      return toast.error("Please Enter OTP");

    }

    try {

      setLoading(true);

      const { data } = await axios.post(

        "http://localhost:5000/api/auth/verify-otp",

        {
          email,
          otp,
        }

      );

      toast.success(data.message);

      navigate("/reset-password", {

        state: {

          email,
          otp,

        },

      });

    }

    catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Invalid OTP"

      );

    }

    finally {

      setLoading(false);

    }

  };

  // ==========================
  // Resend OTP
  // ==========================

  const handleResendOTP = async () => {

    try {

      const { data } = await axios.post(

        "http://localhost:5000/api/auth/forgot-password",

        {
          email,
        }

      );

      toast.success(data.message);

      setOtp("");

      setTimeLeft(300);

      setExpired(false);

    }

    catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Unable to resend OTP"

      );

    }

  };

  return (

    <section className="auth-wrapper">

      <div className="login-box">

        <h1>Verify OTP</h1>

        <p>
          Enter the OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-box">

            <FaKey className="input-icon" />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
            />

          </div>

          <div className="otp-timer">

            {expired ? (

              <span className="expired">
                OTP Expired
              </span>

            ) : (

              <span className="timer-text">
                <FaClock className="timer-icon" />
                OTP expires in: <b>{formatTime()}</b>
              </span>

            )}

          </div>

          <button
            type="submit"
            disabled={loading || expired}
          >

            {loading

              ? "Verifying..."

              : "Verify OTP"}

          </button>

        </form>

        <div className="resend-box">

          {expired ? (

            <button
              className="resend-btn"
              onClick={handleResendOTP}
            >
              Resend OTP
            </button>

          ) : (

            <p>
              Didn't receive the OTP?
            </p>

          )}

        </div>

        <div className="back-login">

          <Link to="/forgot-password">

            ← Back

          </Link>

        </div>

      </div>

    </section>

  );

}

export default VerifyOTP;