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
import ReviewsSection from "../components/ReviewsSection";
import CompareButton from "../components/compare/CompareButton";

import {
  useWishlist,
} from "../context/WishlistContext";

import {
  useCart,
} from "../context/CartContext";

import {
  FaShoppingCart,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaBolt,
} from "react-icons/fa";

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

          rememberRecentlyViewed(selectedProduct);
          
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
        <div className="product-page-inner">

          <h2>
            Loading Product...
          </h2>

        </div>
      </div>

    );

  }

  if (error) {

    return (

      <div className="product-page">
        <div className="product-page-inner">

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
      </div>

    );

  }

  const specs = [
    { label: "Category", value: product.category },
    { label: "Material", value: product.material },
    { label: "Dimensions", value: product.dimensions },
    { label: "Warranty", value: product.warranty },
    { label: "Delivery", value: product.delivery },
  ].filter((spec) => spec.value);

  return (

    <div className="product-page">

      <div className="product-page-inner">

        {/* BREADCRUMB */}

        <div className="product-breadcrumb">

          <span onClick={() => navigate("/")}>
            Home
          </span>
          <span className="crumb-sep">/</span>
          <span onClick={() => navigate("/furniture")}>
            Furniture
          </span>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">
            {product.name}
          </span>

        </div>

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

            <div className="details-meta-row">

              <span className="details-category-chip">
                {product.category}
              </span>

              {product.stock ? (

                <span className="stock-pill in-stock">
                  ✓ In Stock
                </span>

              ) : (

                <span className="stock-pill out-stock">
                  ✕ Out Of Stock
                </span>

              )}

            </div>

            <h1>
              {product.name}
            </h1>

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

            <h2 className="price">

              ₹
              {Number(
                product.priceValue ||
                0
              ).toLocaleString()}

            </h2>

            <p className="description">
              {product.description}
            </p>

            {specs.length > 0 && (

              <div className="specs-grid">

                {specs.map((spec) => (

                  <div
                    className="spec-card"
                    key={spec.label}
                  >
                    <span className="spec-label">
                      {spec.label}
                    </span>
                    <span className="spec-value">
                      {spec.value}
                    </span>
                  </div>

                ))}

              </div>

            )}

            {product.features?.length > 0 && (

              <div className="features">

                <h3>
                  Features
                </h3>

                <div className="feature-chip-group">

                  {product.features.map(
                    (
                      feature,
                      index
                    ) => (

                      <span
                        className="feature-chip"
                        key={index}
                      >
                        ✓ {feature}
                      </span>

                    )
                  )}

                </div>

              </div>

            )}

            {/* BUTTONS */}

            <div className="button-group">

              <button
                className="cart-btn"
                onClick={() =>
                  addToCart(
                    product
                  )
                }
                disabled={Number(product.stock || 0) <= 0}
              >
                <FaShoppingCart className="btn-icon" />
                <span>
                  {Number(product.stock || 0) <= 0
                    ? "Out of Stock"
                    : "Add To Cart"}
                </span>
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
                  ? (
                    <>
                      <FaHeart className="btn-icon" style={{ color: "#ff4d6d" }} />
                      <span>Wishlisted</span>
                    </>
                  )
                  : (
                    <>
                      <FaRegHeart className="btn-icon" />
                      <span>Wishlist</span>
                    </>
                  )}

              </button>

              <button
                className="buy-btn"
                onClick={async () => {
                  if (product) {
                    await addToCart(product);
                    navigate("/checkout");
                  }
                }}
                disabled={Number(product.stock || 0) <= 0}
              >
                <FaBolt className="btn-icon" />
                <span>Buy Now</span>
              </button>

              <CompareButton product={product} />
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
                    type="button"
                    className="furniture-view-btn"
                    onClick={() =>
                      navigate(
                        `/product/${item._id}`
                      )
                    }
                  >
                    <span>View Details</span>
                    <FaEye />
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
                    type="button"
                    className="furniture-view-btn"
                    onClick={() =>
                      navigate(
                        `/product/${item._id}`
                      )
                    }
                  >
                    <span>View Details</span>
                    <FaEye />
                  </button>

                </div>

              )
            )}

          </div>

        </div>

      )}

      <ReviewsSection targetType="Furniture" targetId={id} />

      </div>

    </div>

  );

}

export default ProductDetails;