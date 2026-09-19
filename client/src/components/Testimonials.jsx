import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaQuoteLeft, FaStar, FaRegStar } from "react-icons/fa";
import "../css/Testimonials.css";

function Testimonials() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {

    const fetchFeatured = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/reviews/featured?limit=6"
        );

        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Fetch Featured Reviews Error:", error);
      }
    };

    fetchFeatured();

  }, []);

  if (reviews.length === 0) {
    return null;
  }

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

        {reviews.map((item) => (

          <div className="testimonial-card" key={item._id}>

            <FaQuoteLeft className="quote-icon" />

            <div className="stars">
              {[1, 2, 3, 4, 5].map((n) =>
                n <= item.rating ? (
                  <FaStar key={n} />
                ) : (
                  <FaRegStar key={n} />
                )
              )}
            </div>

            <p className="review">
              "{item.comment}"
            </p>

            <h3>{item.user?.name || "Happy Customer"}</h3>

            <span>
              {item.target?.name || item.target?.title || item.targetType}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Testimonials;