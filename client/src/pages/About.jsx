import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaLightbulb,
  FaUsers,
  FaAward,
} from "react-icons/fa";
import "../css/About.css";

import aboutImg from "../assets/images/about.jpg";
import whyImg from "../assets/images/why.jpg";

function About() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
    orders: 0,
    consultations: 0,
  });

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const { data } = await axios.get(
          "http://localhost:5000/api/stats"
        );

        if (data.success) {
          setStats(data.stats);
        }

      } catch (error) {

        console.log(error);

      }

    };

    fetchStats();

  }, []);

  return (
    <section className="about-page">

      {/* Hero */}
      <div className="about-hero">

        <div className="about-image">
          <img src={aboutImg} alt="Modern Interiors" />
        </div>

        <div className="about-content">

          <span className="about-tag">
            ABOUT MODERN INTERIORS
          </span>

          <h1>
            Creating Beautiful Interiors
            <br />
            Since <span>2015</span>
          </h1>

          <p>
            We create luxurious, elegant and functional interior spaces
            for homes, villas, offices and commercial projects.
            Every project is designed with creativity,
            quality craftsmanship and attention to detail.
          </p>

          <div className="about-list">

            <div>
              <FaCheckCircle className="check-icon" />
              Modern & Creative Designs
            </div>

            <div>
              <FaCheckCircle className="check-icon" />
              Experienced Interior Designers
            </div>

            <div>
              <FaCheckCircle className="check-icon" />
              Premium Quality Materials
            </div>

            <div>
              <FaCheckCircle className="check-icon" />
              On-Time Project Delivery
            </div>

          </div>

          <button
            className="explore-btn"
            onClick={() => navigate("/gallery")}
          >
            Explore Our Projects
          </button>

        </div>

      </div>

      {/* Stats */}

      <div className="about-stats">

        <div className="stat-box">
          <h2>{stats.projects}+</h2>
          <p>Projects Completed</p>
        </div>

        <div className="stat-box">
          <h2>{stats.consultations}+</h2>
          <p>Years Experience</p>
        </div>

        <div className="stat-box">
          <h2>{stats.users}+</h2>
          <p>Happy Clients</p>
        </div>

        <div className="stat-box">
          <h2>{stats.orders}+</h2>
          <p>Expert Designers</p>
        </div>

      </div>

      {/* Features */}

      <div className="features-section">

        <div className="feature-card">

          <FaLightbulb className="feature-icon" />

          <h3>Creative Ideas</h3>

          <p>
            Transforming ordinary spaces into elegant masterpieces.
          </p>

        </div>

        <div className="feature-card">

          <FaUsers className="feature-icon" />

          <h3>Expert Team</h3>

          <p>
            Skilled designers with years of practical experience.
          </p>

        </div>

        <div className="feature-card">

          <FaAward className="feature-icon" />

          <h3>Premium Quality</h3>

          <p>
            We never compromise on quality or customer satisfaction.
          </p>

        </div>

      </div>

      {/* ================= WHY CHOOSE US ================= */}

      <div className="why-section">

        <div className="why-left">

          <span className="why-tag">
            WHY CHOOSE US
          </span>

          <h2>
            We Design Spaces That Inspire
          </h2>

          <p>
            At Modern Interiors, we believe every space should reflect
            your personality and lifestyle. Our team focuses on creativity,
            functionality, and premium quality to deliver interiors that
            exceed expectations.
          </p>

          <div className="why-item">

            <FaCheckCircle className="why-icon" />

            <div>
              <h4>Luxury Interior Designs</h4>
              <p>Elegant and timeless interiors crafted with precision.</p>
            </div>

          </div>

          <div className="why-item">

            <FaCheckCircle className="why-icon" />

            <div>
              <h4>Affordable Pricing</h4>
              <p>Premium quality interiors at competitive prices.</p>
            </div>

          </div>

          <div className="why-item">

            <FaCheckCircle className="why-icon" />

            <div>
              <h4>100% Client Satisfaction</h4>
              <p>Every project is completed with attention to every detail.</p>
            </div>

          </div>

        </div>

        <div className="why-right">

          <img src={whyImg} alt="Interior Design" />

        </div>

      </div>
    </section>
  );
}

export default About;