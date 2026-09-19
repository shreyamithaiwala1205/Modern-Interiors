import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useProjectCategories } from "../context/ProjectCategoryContext";

function Footer() {
  const { categories } = useProjectCategories();

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Company */}

        <div className="footer-box">

          <h2 className="footer-logo">
            Modern<span>Interiors</span>
          </h2>

          <p>
            We create luxurious, elegant and modern interiors
            for homes, offices and commercial spaces with
            premium quality and timeless designs.
          </p>

          <div className="social-links">

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

          </div>

        </div>

        {/* Quick Links */}

        <div className="footer-box">

          <h3>Quick Links</h3>

          <ul>

            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about">About</Link>
            </li>

            <li>
              <Link to="/gallery">Gallery</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>

          </ul>

        </div>

        {/* Project Categories */}

        <div className="footer-box">

          <h3>Project Categories</h3>

          <ul>

            {categories.map((cat) => (
              <li key={cat._id || cat.name}>
                <Link to={`/gallery?category=${cat.name}`}>
                  {cat.label || cat.name}
                </Link>
              </li>
            ))}

          </ul>

        </div>

        {/* Contact */}

        <div className="footer-box">

          <h3>Contact</h3>

          <p>
            <FaMapMarkerAlt className="footer-icon" />
            Ahmedabad, Gujarat
          </p>

          <p>
            <FaPhoneAlt className="footer-icon" />
            +91 79902 12140
          </p>

          <p>
            <FaEnvelope className="footer-icon" />
            moderninteriors2627@gmail.com
          </p>

        </div>

      </div>

      <div className="footer-bottom">

        © 2025 Modern Interiors. All Rights Reserved.

      </div>

    </footer>
  );
}

export default Footer;