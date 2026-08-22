import React, { useState } from "react";
import "../css/ConsultationModal.css";
import consultationImage from "../assets/images/consultation-room.jpg";
import SuccessPopup from "./SuccessPopup";

function ConsultationModal({ isOpen, onClose }) {

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

  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

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

      <div className="consultation-overlay">

        <div className="consultation-modal">

          {/* LEFT SIDE */}

          <div className="consultation-left">

            <img
              src={consultationImage}
              alt="Interior Consultation"
            />

          </div>

          {/* RIGHT SIDE */}

          <div className="consultation-right">

            <button
              className="close-btn"
              onClick={onClose}
            >
              ✕
            </button>

            <h2>Book Consultation</h2>

            <p>
              Let's design your dream home with our
              expert interior designers.
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
                required
              />

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Project Type
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
                  Office
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
                  ₹1 Lakh - ₹3 Lakhs
                </option>

                <option>
                  ₹3 Lakhs - ₹5 Lakhs
                </option>

                <option>
                  ₹5 Lakhs - ₹10 Lakhs
                </option>

                <option>
                  ₹10 Lakhs+
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
                rows="4"
                name="message"
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="submit-btn"
              >
                Book Appointment
              </button>

            </form>

          </div>

        </div>

      </div>

    </>

  );

}

export default ConsultationModal;