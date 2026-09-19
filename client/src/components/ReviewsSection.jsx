import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "../css/ReviewsSection.css";

const API_BASE = "http://localhost:5000/api/reviews";

function Stars({ value, size }) {
  return (
    <span className="review-stars" style={size ? { fontSize: size } : undefined}>
      {[1, 2, 3, 4, 5].map((n) =>
        n <= Math.round(value || 0) ? (
          <FaStar key={n} />
        ) : (
          <FaRegStar key={n} />
        )
      )}
    </span>
  );
}

// Reusable review + rating block for a product (Furniture) or a
// project. Handles fetching approved reviews, showing the average
// rating, and letting a logged-in user submit their own review.
function ReviewsSection({ targetType, targetId }) {

  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!targetId) return;

    setLoading(true);

    try {
      const res = await axios.get(`${API_BASE}/${targetType}/${targetId}`);

      setReviews(res.data.reviews || []);
      setAvgRating(res.data.avgRating || 0);
      setCount(res.data.count || 0);
    } catch (error) {
      console.error("Fetch Reviews Error:", error);
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token || !user) {
      toast.error("Please log in to write a review.");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a short comment.");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        API_BASE,
        {
          targetType,
          targetId,
          rating,
          comment: comment.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review submitted! It will appear once approved.");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reviews-section">

      <div className="reviews-header">
        <h2>Ratings & Reviews</h2>

        {count > 0 ? (
          <div className="reviews-summary">
            <Stars value={avgRating} size="1.3rem" />
            <span className="reviews-avg">{avgRating.toFixed(1)}</span>
            <span className="reviews-count">
              ({count} review{count !== 1 ? "s" : ""})
            </span>
          </div>
        ) : (
          <p className="reviews-empty-summary">
            No reviews yet — be the first to share your experience.
          </p>
        )}
      </div>

      <form className="review-form" onSubmit={handleSubmit}>

        <div className="review-form-stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              className="review-star-btn"
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(n)}
              aria-label={`Rate ${n} star${n !== 1 ? "s" : ""}`}
            >
              {n <= (hoverRating || rating) ? <FaStar /> : <FaRegStar />}
            </button>
          ))}
        </div>

        <textarea
          className="review-form-textarea"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />

        <button
          type="submit"
          className="review-form-submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>

      </form>

      <div className="reviews-list">

        {loading ? (
          <p className="reviews-loading">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="reviews-empty-summary">No approved reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review._id}>

              <div className="review-card-header">
                <FaUserCircle className="review-user-icon" />

                <div>
                  <h4>{review.user?.name || "Anonymous"}</h4>
                  <Stars value={review.rating} />
                </div>

                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="review-comment">{review.comment}</p>

            </div>
          ))
        )}

      </div>

    </section>
  );
}

export default ReviewsSection;
