import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaExclamationCircle, FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaLayerGroup, FaCoins, FaCommentDots } from "react-icons/fa";
import "../css/Consultation.css";

function Consultation() {
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

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

  const [errors, setErrors] = useState({});

  // Minimum date allowed is today
  const todayDateStr = new Date().toISOString().split("T")[0];

  // Validate a single field
  const validateField = (name, value, allData = formData) => {
    switch (name) {
      case "name": {
        const val = (value || "").trim();
        if (!val) {
          return "Full Name is required.";
        }
        if (!/^[A-Za-z\s]{2,50}$/.test(val)) {
          return "Name must contain only letters and spaces (2 to 50 characters).";
        }
        return "";
      }

      case "email": {
        const val = (value || "").trim();
        if (!val) {
          return "Email address is required.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return "Please enter a valid email address (e.g. name@example.com).";
        }
        return "";
      }

      case "phone": {
        const val = (value || "").trim();
        if (!val) {
          return "Phone number is required.";
        }
        const digits = val.replace(/\D/g, "");
        if (digits.length !== 10) {
          return "Phone number must be exactly 10 digits.";
        }
        return "";
      }

      case "project": {
        if (!value || !value.trim()) {
          return "Please select a project type.";
        }
        return "";
      }

      case "budget": {
        if (!value || !value.trim()) {
          return "Please select your estimated budget.";
        }
        return "";
      }

      case "date": {
        if (!value) {
          return "Consultation date is required.";
        }
        const selectedDate = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return "Consultation date cannot be in the past.";
        }
        return "";
      }

      case "time": {
        if (!value) {
          return "Consultation time is required.";
        }
        if (allData.date === todayDateStr) {
          const [hours, minutes] = value.split(":").map(Number);
          const now = new Date();
          const selectedTime = new Date();
          selectedTime.setHours(hours, minutes, 0, 0);
          if (selectedTime <= now) {
            return "Please select a future time slot for today.";
          }
        }
        return "";
      }

      case "message": {
        const val = (value || "").trim();
        if (!val) {
          return "Project description is required.";
        }
        if (val.length < 10) {
          return `Description is too short (${val.length}/10 min characters).`;
        }
        if (val.length > 500) {
          return "Description cannot exceed 500 characters.";
        }
        return "";
      }

      default:
        return "";
    }
  };

  // Validate entire form and return boolean + errors object
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field], formData);
      if (err) {
        newErrors[field] = err;
      }
    });
    setErrors(newErrors);
    return newErrors;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    // If field has already been touched, validate on the fly
    if (touched[name]) {
      const err = validateField(name, value, updatedData);
      setErrors((prev) => ({
        ...prev,
        [name]: err,
      }));
    }
  };

  // Handle Blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value, formData);
    setErrors((prev) => ({
      ...prev,
      [name]: err,
    }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const validationErrors = validateForm();
    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length > 0) {
      const firstError = validationErrors[errorKeys[0]];
      toast.error(firstError || "Please correct the errors in the form.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/consultation",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          project: formData.project,
          budget: formData.budget,
          date: formData.date,
          time: formData.time,
          message: formData.message.trim(),
        }
      );

      toast.success(data.message || "Consultation booked successfully! We will contact you shortly.");

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

      setErrors({});
      setTouched({});

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to submit consultation request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="consultation-page">
      <div className="consultation-card">
        <h2>Book Free Consultation</h2>
        <p>
          Schedule a personalized consultation with our senior interior design architects.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                placeholder="Full Name (e.g. John Doe)"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.name && touched.name ? "input-error" : touched.name && !errors.name ? "input-valid" : ""}
              />
            </div>
            {errors.name && touched.name && (
              <div className="error-message">
                <FaExclamationCircle />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email Address (e.g. name@example.com)"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email && touched.email ? "input-error" : touched.email && !errors.email ? "input-valid" : ""}
              />
            </div>
            {errors.email && touched.email && (
              <div className="error-message">
                <FaExclamationCircle />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="tel"
                name="phone"
                placeholder="10-Digit Mobile Number (e.g. 9876543210)"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={10}
                className={errors.phone && touched.phone ? "input-error" : touched.phone && !errors.phone ? "input-valid" : ""}
              />
            </div>
            {errors.phone && touched.phone && (
              <div className="error-message">
                <FaExclamationCircle />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Project Type */}
          <div className="form-group">
            <div className="input-wrapper">
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.project && touched.project ? "input-error" : touched.project && !errors.project ? "input-valid" : ""}
              >
                <option value="">Select Project Type *</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Modular Kitchen</option>
                <option value="Office Interior">Office Interior</option>
                <option value="Villa">Luxury Villa</option>
                <option value="Commercial Space">Commercial Space</option>
                <option value="Complete Home">Complete Home Interior</option>
              </select>
            </div>
            {errors.project && touched.project && (
              <div className="error-message">
                <FaExclamationCircle />
                <span>{errors.project}</span>
              </div>
            )}
          </div>

          {/* Budget Range */}
          <div className="form-group">
            <div className="input-wrapper">
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.budget && touched.budget ? "input-error" : touched.budget && !errors.budget ? "input-valid" : ""}
              >
                <option value="">Select Estimated Budget *</option>
                <option value="Below ₹50,000">Below ₹50,000</option>
                <option value="₹50,000 - ₹1 Lakh">₹50,000 - ₹1 Lakh</option>
                <option value="₹1 Lakh - ₹3 Lakhs">₹1 Lakh - ₹3 Lakhs</option>
                <option value="₹3 Lakhs - ₹5 Lakhs">₹3 Lakhs - ₹5 Lakhs</option>
                <option value="Above ₹5 Lakhs">Above ₹5 Lakhs</option>
              </select>
            </div>
            {errors.budget && touched.budget && (
              <div className="error-message">
                <FaExclamationCircle />
                <span>{errors.budget}</span>
              </div>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="row">
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="date"
                  name="date"
                  min={todayDateStr}
                  value={formData.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.date && touched.date ? "input-error" : touched.date && !errors.date ? "input-valid" : ""}
                />
              </div>
              {errors.date && touched.date && (
                <div className="error-message">
                  <FaExclamationCircle />
                  <span>{errors.date}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.time && touched.time ? "input-error" : touched.time && !errors.time ? "input-valid" : ""}
                />
              </div>
              {errors.time && touched.time && (
                <div className="error-message">
                  <FaExclamationCircle />
                  <span>{errors.time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Message / Project Details */}
          <div className="form-group">
            <div className="input-wrapper">
              <textarea
                rows="4"
                name="message"
                placeholder="Describe your design preferences, square footage, requirements... (min 10 characters)"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={500}
                className={errors.message && touched.message ? "input-error" : touched.message && !errors.message ? "input-valid" : ""}
              />
            </div>
            <div className="textarea-footer">
              {errors.message && touched.message ? (
                <div className="error-message">
                  <FaExclamationCircle />
                  <span>{errors.message}</span>
                </div>
              ) : (
                <span className="char-count">{formData.message.length}/500</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="consultation-submit-btn"
          >
            {loading ? "Booking Consultation..." : "Book Free Consultation"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Consultation;