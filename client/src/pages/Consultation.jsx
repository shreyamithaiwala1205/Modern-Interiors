import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/Consultation.css";

function Consultation() {

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
    return toast.error("Enter a valid full name.");
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
    return toast.error("Phone number must be exactly 10 digits.");
    }

    if (formData.message.trim().length < 10) {
       return toast.error("Message should contain at least 10 characters.");
    }

    try {

      setLoading(true);

      const { data } = await axios.post(

        "http://localhost:5000/api/consultation",

        formData

      );

      toast.success(data.message);

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

        "Unable to submit consultation."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <section className="consultation-page">

      <div className="consultation-card">

        <h2>Book Free Consultation</h2>

        <p>

          Schedule a free consultation with our
          interior design experts.

        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            pattern="^[A-Za-z ]+$"
            title="Only alphabets and spaces are allowed"
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
            title="Enter a valid 10-digit phone number"
            required
          />

          <select

            name="project"
            
            value={formData.project}

            onChange={handleChange}

            required

          >

            <option value="" disabled>
              Select Project Type
            </option>

            <option>Living Room</option>

            <option>Bedroom</option>

            <option>Kitchen</option>

            <option>Office Interior</option>

            <option>Villa</option>

            <option>Commercial Space</option>

            <option>Complete Home</option>

          </select>

          <select

            name="budget"

            value={formData.budget}

            onChange={handleChange}

            required

          >

            <option value="" disabled>
              Select Budget
            </option>

            <option>Below ₹50,000</option>

            <option>₹50,000 - ₹1 Lakh</option>

            <option>₹1 Lakh - ₹3 Lakhs</option>

            <option>₹3 Lakhs - ₹5 Lakhs</option>

            <option>Above ₹5 Lakhs</option>

          </select>

          <div className="row">

            <input
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]}
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
            rows="5"
            name="message"
            placeholder="Describe your project requirements..."
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

                ? "Submitting..."

                : "Book Free Consultation"

            }

          </button>

        </form>

      </div>

    </section>

  );

}

export default Consultation;