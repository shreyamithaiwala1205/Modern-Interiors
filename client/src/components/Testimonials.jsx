import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import "../css/Testimonials.css";

function Testimonials() {

  const testimonials = [
    {
      name: "Priya Shah",
      role: "Home Owner",
      review:
        "Modern Interiors completely transformed our living space. Every detail was beautifully designed and the final result exceeded our expectations."
    },
    {
      name: "Rahul Patel",
      role: "Business Owner",
      review:
        "Professional team with creative ideas and excellent execution. The entire project was completed on time with premium quality."
    },
    {
      name: "Neha Mehta",
      role: "Villa Owner",
      review:
        "Highly recommended for anyone looking for elegant and luxurious interiors. Amazing craftsmanship and outstanding customer service."
    }
  ];

  return (
    <section className="testimonials">

      <div className="testimonial-title">

        <span>CLIENT TESTIMONIALS</span>

        <h2>What Our Clients Say</h2>

        <p>
          Our clients trust us for creating beautiful interiors with
          quality, creativity and attention to every detail.
        </p>

      </div>

      <div className="testimonial-container">

        {testimonials.map((item, index) => (

          <div className="testimonial-card" key={index}>

            <FaQuoteLeft className="quote-icon" />

            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <p className="review">
              "{item.review}"
            </p>

            <h3>{item.name}</h3>

            <span>{item.role}</span>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Testimonials;