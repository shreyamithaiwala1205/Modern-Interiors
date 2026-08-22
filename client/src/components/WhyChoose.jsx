import React from "react";
import "../css/WhyChoose.css";
import { FaAward, FaUsers, FaHome, FaHeadset } from "react-icons/fa";

function WhyChoose() {
  return (
    <section className="why">

      <div className="why-title">
        <h2>Why Choose Modern Interiors?</h2>
        <p>
          We transform ordinary spaces into luxurious s with creativity,
          quality and innovation.
        </p>
      </div>

      <div className="why-container">

        <div className="why-card">
          <FaAward className="why-icon"/>
          <h3>10+ Years Experience</h3>
          <p>
            Delivering premium interior design solutions with excellence.
          </p>
        </div>

        <div className="why-card">
          <FaUsers className="why-icon"/>
          <h3>500+ Happy Clients</h3>
          <p>
            Trusted by homeowners and businesses across the country.
          </p>
        </div>

        <div className="why-card">
          <FaHome className="why-icon"/>
          <h3>Modern Designs</h3>
          <p>
            Modern, elegant and customized interiors for every space.
          </p>
        </div>

        <div className="why-card">
          <FaHeadset className="why-icon"/>
          <h3>24/7 Support</h3>
          <p>
            Dedicated support from consultation to project completion.
          </p>
        </div>

      </div>

    </section>
  );
}

export default WhyChoose;