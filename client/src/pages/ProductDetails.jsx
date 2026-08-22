import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import getImageUrl from "../utils/imageUrl";

import {
  useWishlist,
} from "../context/WishlistContext";

import {
  useCart,
} from "../context/CartContext";

import "../css/ProductDetails.css";

function ProductDetails() {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    addToCart,
  } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const [product, setProduct] =
    useState(null);

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [recentProducts, setRecentProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    window.scrollTo(
      0,
      0
    );

    const fetchProduct =
      async () => {

        try {

          setLoading(true);

          const response =
            await axios.get(
              "http://localhost:5000/api/furniture"
            );

          const allProducts =
            response.data
              .furniture;

          const selectedProduct =
            allProducts.find(
              (item) =>
                item._id === id
            );

          if (
            !selectedProduct
          ) {

            setError(
              "Product Not Found"
            );

            return;

          }

          setProduct(
            selectedProduct
          );

          const viewed =
            JSON.parse(
              localStorage.getItem(
                "recentProducts"
              )
            ) || [];

          const filteredViewed =
            viewed.filter(
              (item) =>
                item._id !==
                selectedProduct._id
            );

          filteredViewed.unshift(
            selectedProduct
          );

          localStorage.setItem(
            "recentProducts",
            JSON.stringify(
              filteredViewed.slice(
                0,
                8
              )
            )
          );

          setRecentProducts(
            filteredViewed
              .filter(
                (item) =>
                  item._id !==
                  selectedProduct._id
              )
              .slice(0, 4)
          );

          const related =
            allProducts
              .filter(
                (item) =>
                  item.category ===
                    selectedProduct.category &&
                  item._id !==
                    selectedProduct._id
              )
              .slice(0, 4);

          setRelatedProducts(
            related
          );

        } catch (err) {

          console.error(err);

          setError(
            "Unable to load product."
          );

        } finally {

          setLoading(false);

        }

      };

    fetchProduct();

  }, [id]);

  if (loading) {

    return (

      <div className="product-page">

        <h2>
          Loading Product...
        </h2>

      </div>

    );

  }

  if (error) {

    return (

      <div className="product-page">

        <h2>
          {error}
        </h2>

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              "/furniture"
            )
          }
        >
          ← Back
        </button>

      </div>

    );

  }

  return (

    <div className="product-page">

      {/* BACK BUTTON */}

      <button
        className="back-btn"
        onClick={() =>
          navigate(
            "/furniture"
          )
        }
      >
        ← Back To Furniture
      </button>

      <div className="product-container">

        {/* LEFT */}

        <div className="image-section">

          <img
            src={getImageUrl(
              product.image
            )}
            alt={
              product.name
            }
            className="main-image"
          />

        </div>

        {/* RIGHT */}

        <div className="details-section">

          <h1>
            {product.name}
          </h1>

          <h2 className="price">

            ₹
            {Number(
              product.priceValue ||
              0
            ).toLocaleString()}

          </h2>

          <div className="rating">

            {"★".repeat(
              Math.floor(
                product.rating
              )
            )}

            {"☆".repeat(
              Math.max(
                0,
                5 -
                  Math.floor(
                    product.rating
                  )
              )
            )}

            <span>
              ({product.rating})
            </span>

          </div>

          <div className="stock">

            {product.stock ? (

              <span className="in-stock">
                ✅ In Stock
              </span>

            ) : (

              <span className="out-stock">
                ❌ Out Of Stock
              </span>

            )}

          </div>

          <p className="description">
            {product.description}
          </p>

          <div className="info-box">

            <h3>
              Category
            </h3>

            <p>
              {product.category}
            </p>

          </div>

          <div className="info-box">

            <h3>
              Material
            </h3>

            <p>
              {product.material}
            </p>

          </div>

          <div className="info-box">

            <h3>
              Dimensions
            </h3>

            <p>
              {product.dimensions}
            </p>

          </div>

          <div className="info-box">

            <h3>
              Warranty
            </h3>

            <p>
              {product.warranty}
            </p>

          </div>

          <div className="info-box">

            <h3>
              Delivery
            </h3>

            <p>
              {product.delivery}
            </p>

          </div>

          <div className="features">

            <h3>
              Features
            </h3>

            <ul>

              {product.features?.map(
                (
                  feature,
                  index
                ) => (

                  <li
                    key={index}
                  >
                    ✔ {feature}
                  </li>

                )
              )}

            </ul>

          </div>

          {/* BUTTONS */}

          <div className="button-group">

            <button
              className="cart-btn"
              onClick={() =>
                addToCart(
                  product
                )
              }
            >
              🛒 Add To Cart
            </button>

            <button
              className="wishlist-btn"
              onClick={() =>
                toggleWishlist(
                  product
                )
              }
            >

              {isWishlisted(
                product._id
              )
                ? "❤️ Wishlisted"
                : "♡ Wishlist"}

            </button>

            <button
              className="buy-btn"
              onClick={() =>
                alert(
                  "Proceeding To Checkout..."
                )
              }
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* RECENTLY VIEWED */}

      {recentProducts.length >
        0 && (

        <div className="related-section">

          <h2>
            Recently Viewed
          </h2>

          <div className="related-grid">

            {recentProducts.map(
              (item) => (

                <div
                  className="related-card"
                  key={
                    item._id
                  }
                >

                  <img
                    src={getImageUrl(
                      item.image
                    )}
                    alt={
                      item.name
                    }
                  />

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    ₹
                    {Number(
                      item.priceValue ||
                      0
                    ).toLocaleString()}
                  </p>

                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        `/product/${item._id}`
                      )
                    }
                  >
                    View Details
                  </button>

                </div>

              )
            )}

          </div>

        </div>

      )}

      {/* RELATED PRODUCTS */}

      {relatedProducts.length >
        0 && (

        <div className="related-section">

          <h2>
            Related Products
          </h2>

          <div className="related-grid">

            {relatedProducts.map(
              (item) => (

                <div
                  className="related-card"
                  key={
                    item._id
                  }
                >

                  <img
                    src={getImageUrl(
                      item.image
                    )}
                    alt={
                      item.name
                    }
                  />

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    ₹
                    {Number(
                      item.priceValue ||
                      0
                    ).toLocaleString()}
                  </p>

                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        `/product/${item._id}`
                      )
                    }
                  >
                    View Details
                  </button>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>

  );

}

export default ProductDetails;