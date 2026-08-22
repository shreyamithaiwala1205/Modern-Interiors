import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import "../css/BookConsultation.css";
import consultationImage from "../assets/images/consultation-room.jpg";
import SuccessPopup from "./SuccessPopup";

function BookConsultation({ isOpen, onClose }) {

  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    phone: "",

    project: "",
    budget: "",

    date: "",
    time: "",

    message: "",

  });

  // ==================================
  // ESC Close
  // ==================================

  useEffect(() => {

    const handleEsc = (e) => {

      if (e.key === "Escape") {

        onClose();

      }

    };

    window.addEventListener("keydown", handleEsc);

    return () =>
      window.removeEventListener("keydown", handleEsc);

  }, [onClose]);

  if (!isOpen) return null;

  // ==================================
  // Handle Input
  // ==================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  // ==================================
  // Submit Form
  // ==================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const { data } = await axios.post(

        "http://localhost:5000/api/consultation",

        formData

      );

      toast.success(data.message);

      setShowSuccess(true);

      setFormData({

        name: "",
        email: "",
        phone: "",

        project: "",
        budget: "",

        date: "",
        time: "",

        message: "",

      });

    }

    catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Unable to book consultation."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <>

      <SuccessPopup

        show={showSuccess}

        onClose={() => {

          setShowSuccess(false);

          onClose();

        }}

      />

      <div
        className="consultation-overlay"
        onClick={onClose}
      >

        <div

          className="consultation-modal"

          onClick={(e) => e.stopPropagation()}

        >

          <div className="consultation-left">

            <img
              src={consultationImage}
              alt="Consultation"
            />

          </div>

          <div className="consultation-right">

            <button

              className="close-btn"

              onClick={onClose}

            >

              ✕

            </button>

            <h2>Book Free Consultation</h2>

            <p>

              Schedule a free consultation with our
              interior experts.

            </p>

            <form onSubmit={handleSubmit}>

              <input

                type="text"

                name="name"

                placeholder="Full Name"

                value={formData.name}

                onChange={handleChange}

                required

              />

              <input

                type="email"

                name="email"

                placeholder="Email Address"

                value={formData.email}

                onChange={handleChange}

                required

              />

              <input

                type="tel"

                name="phone"

                placeholder="Phone Number"

                value={formData.phone}

                onChange={handleChange}

                maxLength={10}

                required

              />

              <select

                name="project"

                value={formData.project}

                onChange={handleChange}

                required

              >

                <option value="">
                  Select Project
                </option>

                <option>
                  Living Room
                </option>

                <option>
                  Bedroom
                </option>

                <option>
                  Kitchen
                </option>

                <option>
                  Office Interior
                </option>

                <option>
                  Villa
                </option>

                <option>
                  Commercial Space
                </option>

                <option>
                  Complete Home
                </option>

              </select>

              <select

                name="budget"

                value={formData.budget}

                onChange={handleChange}

                required

              >

                <option value="">
                  Select Budget
                </option>

                <option>
                  Below ₹50,000
                </option>

                <option>
                  ₹50,000 - ₹1 Lakh
                </option>

                <option>
                  ₹1 Lakh - ₹3 Lakhs
                </option>

                <option>
                  ₹3 Lakhs - ₹5 Lakhs
                </option>

                <option>
                  Above ₹5 Lakhs
                </option>

              </select>

              <div className="date-time">

                <input

                  type="date"

                  name="date"

                  value={formData.date}

                  onChange={handleChange}

                  required

                />

                <input

                  type="time"

                  name="time"

                  value={formData.time}

                  onChange={handleChange}

                  required

                />

              </div>

              <textarea

                name="message"

                rows="5"

                placeholder="Tell us about your project..."

                value={formData.message}

                onChange={handleChange}

              />

              <button

                type="submit"

                className="submit-btn"

                disabled={loading}

              >

                {

                  loading

                    ? "Booking..."

                    : "Book Free Consultation"

                }

              </button>

            </form>

          </div>

        </div>

      </div>

    </>

  );

}

export default BookConsultation;