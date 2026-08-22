import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

import "../css/Contact.css";

function Contact() {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",

  });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Name Validation
    if (!/^[A-Za-z ]+$/.test(formData.name)) {

      return toast.error(
        "Name should contain only alphabets."
      );

    }

    // Phone Validation
    if (!/^[0-9]{10}$/.test(formData.phone)) {

      return toast.error(
        "Phone number must be exactly 10 digits."
      );

    }

    // Message Validation
    if (formData.message.trim().length < 10) {

      return toast.error(
        "Message should contain at least 10 characters."
      );

    }

    try {

      setLoading(true);

      const { data } = await axios.post(

        "http://localhost:5000/api/contact",

        formData

      );

      toast.success(data.message);

      setFormData({

        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",

      });

    }

    catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Unable to send message."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <section className="contact-page">

      <div className="contact-container">

        {/* Left Side */}

        <div className="contact-info">

          <h2>Contact Us</h2>

          <p>

            We'd love to hear from you.
            Send us a message or contact us directly.

          </p>

          <div className="info-box">

            <FaMapMarkerAlt className="icon" />

            <div>

              <h4>Address</h4>

              <p>Ahmedabad, Gujarat, India</p>

            </div>

          </div>

          <div className="info-box">

            <FaPhoneAlt className="icon" />

            <div>

              <h4>Phone</h4>

              <p>+91 9876543210</p>

            </div>

          </div>

          <div className="info-box">

            <FaEnvelope className="icon" />

            <div>

              <h4>Email</h4>

              <p>moderninteriors2627@gmail.com</p>

            </div>

          </div>

          <div className="info-box">

            <FaClock className="icon" />

            <div>

              <h4>Working Hours</h4>

              <p>Mon - Sat : 9 AM - 7 PM</p>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="contact-card">

          <h3>Send Message</h3>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              pattern="^[A-Za-z ]+$"
              title="Only alphabets allowed"
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
              pattern="[0-9]{10}"
              maxLength={10}
              title="Enter 10 digit phone number"
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Your Message..."
              value={formData.message}
              onChange={handleChange}
              minLength={10}
              maxLength={500}
              required
            />

            <button
              type="submit"
              disabled={loading}
            >

              {

                loading

                  ? "Sending..."

                  : "Send Message"

              }

            </button>

          </form>

        </div>

      </div>

      {/* Google Map */}

      <div className="map-section">

        <iframe
          title="Google Map"
          src="https://www.google.com/maps?q=Ahmedabad&output=embed"
          loading="lazy"
        ></iframe>

      </div>

    </section>

  );

}

export default Contact;