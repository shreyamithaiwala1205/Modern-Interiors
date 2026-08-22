import React from "react";
import "../css/Services.css";
import { FaArrowRight } from "react-icons/fa";

import living from "../assets/images/living-room.jpg";
import bedroom from "../assets/images/bedroom.jpg";
import kitchen from "../assets/images/kitchen.jpg";
import office from "../assets/images/office.jpg";
import villa from "../assets/images/villa.jpg";
import commercial from "../assets/images/commercial.jpg";

const services = [
  {
    image: living,
    title: "Living Room Design",
    desc: "Elegant living spaces with modern aesthetics."
  },
  {
    image: bedroom,
    title: "Bedroom Interior",
    desc: "Comfortable and luxurious bedroom designs."
  },
  {
    image: kitchen,
    title: "Modular Kitchen",
    desc: "Smart kitchens with premium finishes."
  },
  {
    image: office,
    title: "Office Interior",
    desc: "Professional office spaces for productivity."
  },
  {
    image: villa,
    title: "Villa Design",
    desc: "Luxury villa interiors with timeless elegance."
  },
  {
    image: commercial,
    title: "Commercial Space",
    desc: "Stylish commercial interiors for your business."
  }
];

function Services() {
  return (
    <section className="services">

      <div className="section-title">
        <span>OUR SERVICES</span>
        <h2>Luxury Interior Solutions</h2>
        <p>
          We design elegant and functional interiors that perfectly blend
          luxury, comfort and modern lifestyle.
        </p>
      </div>

      <div className="service-container">

        {services.map((item, index) => (

          <div className="service-card" key={index}>

            <div className="service-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="service-content">

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

              <button>
                Read More
                <FaArrowRight />
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Services;