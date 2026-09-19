import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFire, FaEye } from "react-icons/fa";

import getImageUrl from "../utils/imageUrl";
import "../css/TrendingProducts.css";

function TrendingProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/furniture"
        );

        const items = Array.isArray(data?.furniture)
          ? data.furniture
          : [];

        const trending = items.filter(
          (item) =>
            Array.isArray(item.tags) &&
            item.tags.some(
              (tag) =>
                String(tag).toLowerCase() === "trending"
            )
        );

        setProducts(trending.slice(0, 8));
      } catch (error) {
        console.error(
          "FETCH TRENDING PRODUCTS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="trending-section">

      <div className="trending-heading">
        <span>WHAT'S HOT RIGHT NOW</span>
        <h2>Trending Products</h2>
        <p>
          Discover the pieces our customers are
          loving right now, hand-picked by our
          design team.
        </p>
      </div>

      <div className="trending-grid">

        {products.map((item, index) => (

          <motion.div
            className="trending-card"
            key={item._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: Math.min(index * 0.08, 0.4),
            }}
            onClick={() =>
              navigate(`/product/${item._id}`)
            }
          >

            <div className="trending-img-box">

              <span className="trending-badge">
                <FaFire /> Trending
              </span>

              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                loading="lazy"
              />

              <div className="trending-overlay">
                <span className="trending-view-btn">
                  <FaEye /> View Details
                </span>
              </div>

            </div>

            <div className="trending-info">
              <h3>{item.name}</h3>
              <p className="trending-price">
                ₹
                {Number(
                  item.priceValue || 0
                ).toLocaleString()}
              </p>
            </div>

          </motion.div>

        ))}

      </div>

      <div className="trending-cta">
        <button
          type="button"
          onClick={() => navigate("/furniture")}
        >
          Shop All Furniture
        </button>
      </div>

    </section>
  );
}

export default TrendingProducts;
