import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "../css/Hero.css";
import hero from "../assets/images/hero.jpg";

function Hero() {

  //const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();
  return (
    <>

      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.65)), url(${hero})`,
        }}
      >

        <div className="hero-overlay"></div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >

          <span className="hero-subtitle">
            ✨ Modern Interior Design Studio
          </span>

          <h1>
            Transform Your
            <br />
            Dream Home
            <br />
            Into Reality
          </h1>

          <p>
            We create luxurious interiors for villas,
            apartments, offices and commercial spaces
            with elegance, creativity and timeless beauty.
          </p>

          <div className="hero-buttons">

            <Link
              to="/gallery"
              className="gold-btn"
            >
              Explore Projects
            </Link>

            <button
              className="outline-btn"
              onClick={() => navigate("/consultation")}
            >
              Book Consultation
            </button>

          </div>

        </motion.div>
      </section>
    </>
  );
}

export default Hero;