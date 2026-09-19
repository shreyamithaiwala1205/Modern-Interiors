import React, {
  useState,
  useEffect,
} from "react";

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

import {
  getFriendlyErrorMessage,
} from "../utils/errorHandler";

import "../css/ForgotPassword.css";


function ResetPassword() {

  const navigate = useNavigate();

  const location = useLocation();


  // =====================================================
  // EMAIL + OTP FROM VERIFY OTP PAGE
  // =====================================================

  const email =
    location.state?.email || "";

  const otp =
    location.state?.otp || "";


  // =====================================================
  // STATES
  // =====================================================

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


  // =====================================================
  // CHECK EMAIL + OTP
  // =====================================================

  useEffect(() => {

    if (!email || !otp) {

      navigate(
        "/forgot-password",
        {
          replace: true,
        }
      );

    }

  }, [
    email,
    otp,
    navigate,
  ]);


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleResetPassword =
    async (e) => {

      e.preventDefault();


      // ===============================================
      // PASSWORD VALIDATION
      // ===============================================

      if (
        !password.trim() ||
        !confirmPassword.trim()
      ) {

        toast.error(
          "Please fill in both password fields."
        );

        return;

      }


      if (
        password.length < 6
      ) {

        toast.error(
          "Password must be at least 6 characters long."
        );

        return;

      }


      if (
        password !==
        confirmPassword
      ) {

        toast.error(
          "Passwords do not match. Please verify."
        );

        return;

      }


      // ===============================================
      // API CALL
      // ===============================================

      try {

        setLoading(true);


        const { data } =
          await axios.post(

            "http://localhost:5000/api/auth/reset-password",

            {
              email,
              otp,
              password,
            }

          );


        // =============================================
        // SUCCESS
        // =============================================

        toast.success(
          data.message ||
          "Password reset successfully! Please log in."
        );


        setPassword("");

        setConfirmPassword("");


        setTimeout(() => {

          navigate(
            "/account",
            {
              replace: true,
            }
          );

        }, 1200);

      }

      // ===============================================
      // ERROR
      // ===============================================

      catch (error) {

        console.error(
          "RESET PASSWORD ERROR:",
          error
        );


        const errorMsg =
          getFriendlyErrorMessage(
            error,
            "Unable to reset password. Please try again."
          );


        toast.error(
          errorMsg
        );

      }

      // ===============================================
      // FINALLY
      // ===============================================

      finally {

        setLoading(false);

      }

    };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <section className="auth-wrapper">

      <div className="login-box">


        {/* ==========================================
            TITLE
        ========================================== */}

        <h1>
          Reset Password
        </h1>


        <p>
          Enter your new password.
        </p>


        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={
            handleResetPassword
          }
        >


          {/* ========================================
              NEW PASSWORD
          ======================================== */}

          <div className="input-box">

            <FaLock
              className="input-icon"
            />


            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              placeholder="New Password"

              value={
                password
              }

              onChange={(e) => {

                setPassword(
                  e.target.value
                );

              }}

              autoComplete="new-password"

              minLength={6}

              required
            />


            <span
              className="eye"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >

              {showPassword

                ? <FaEyeSlash />

                : <FaEye />

              }

            </span>

          </div>


          {/* ========================================
              CONFIRM PASSWORD
          ======================================== */}

          <div className="input-box">

            <FaLock
              className="input-icon"
            />


            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }

              placeholder="Confirm Password"

              value={
                confirmPassword
              }

              onChange={(e) => {

                setConfirmPassword(
                  e.target.value
                );

              }}

              autoComplete="new-password"

              minLength={6}

              required
            />


            <span
              className="eye"

              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >

              {showConfirmPassword

                ? <FaEyeSlash />

                : <FaEye />

              }

            </span>

          </div>


          {/* ========================================
              SUBMIT BUTTON
          ======================================== */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading

              ? "Updating..."

              : "Reset Password"

            }

          </button>


        </form>

      </div>

    </section>

  );

}


export default ResetPassword;