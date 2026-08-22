import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";

function ResetPassword() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  useEffect(() => {

    if (!email || !otp) {

        navigate("/forgot-password");

    }

    }, [email, otp, navigate]);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!password || !confirmPassword) {

      return toast.error("Please fill all fields");

    }

    if (password !== confirmPassword) {

      return toast.error(
        "Passwords do not match"
      );

    }

    try {

      setLoading(true);

      const { data } = await axios.post(

        "http://localhost:5000/api/auth/reset-password",

        {
          email,
          otp,
          password,
        }

      );

      toast.success(data.message);

      setTimeout(() => {

        navigate("/account");

      }, 1200);

    }

    catch (error) {

      toast.error(

        error.response?.data?.message ||
        "Password Reset Failed"

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <section className="auth-wrapper">

      <div className="login-box">

        <h1>Reset Password</h1>

        <p>
          Enter your new password.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-box">

            <FaLock className="input-icon"/>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="New Password"
              value={password}
              onChange={(e)=>
                setPassword(e.target.value)
              }
            />

            <span
              className="eye"
              onClick={()=>
                setShowPassword(!showPassword)
              }
            >
              {showPassword
                ? <FaEyeSlash/>
                : <FaEye/>
              }
            </span>

          </div>

          <div className="input-box">

            <FaLock className="input-icon"/>

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>
                setConfirmPassword(e.target.value)
              }
            />

            <span
              className="eye"
              onClick={()=>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? <FaEyeSlash/>
                : <FaEye/>
              }
            </span>

          </div>

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Updating..."
              : "Reset Password"}

          </button>

        </form>

      </div>

    </section>

  );

}

export default ResetPassword;