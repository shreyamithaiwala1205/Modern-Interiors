import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import axios from "axios";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaEye,
  FaShoppingBag,
  FaPlus,
  FaMinus,
  FaSlidersH,
} from "react-icons/fa";
import toast from "react-hot-toast";

import getImageUrl from "../utils/imageUrl";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import "../css/Furniture.css";

function FurnitureGallery() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    getItemQuantity,
  } = useCart();

  const [furnitureData, setFurnitureData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 6;

  const [filters, setFilters] = useState({
    category: [],
    material: [],
    rating: 0,
    stock: "all",
    sort: "default",
  });

  const [maxPrice, setMaxPrice] =
    useState(50000);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    ...new Set(
      furnitureData
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // MATERIALS
  // ==========================================

  const materials = [
    ...new Set(
      furnitureData
        .map((item) => item.material)
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // FETCH FURNITURE
  // ==========================================

  useEffect(() => {

    const fetchFurniture = async () => {

      try {

        setLoading(true);
        setError("");

        const { data } = await axios.get(
          "http://localhost:5000/api/furniture"
        );

        if (data.success) {

          setFurnitureData(
            Array.isArray(data.furniture)
              ? data.furniture
              : []
          );

        } else {

          setFurnitureData([]);

        }

      } catch (err) {

        console.error(
          "FETCH FURNITURE ERROR:",
          err
        );

        setError(
          "Unable to load furniture."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchFurniture();

  }, []);

  // ==========================================
  // SEARCH SUGGESTIONS
  // ==========================================

  useEffect(() => {

    if (!search.trim()) {

      setSuggestions([]);

      return;

    }

    const result =
      furnitureData
        .filter((item) =>
          (item.name || "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )
        .slice(0, 5);

    setSuggestions(result);

  }, [
    search,
    furnitureData,
  ]);

  // ==========================================
  // TOGGLE FILTER
  // ==========================================

  const toggleFilter = (
    type,
    value
  ) => {

    setCurrentPage(1);

    setFilters((prev) => {

      const exists =
        prev[type].includes(value);

      return {
        ...prev,

        [type]: exists
          ? prev[type].filter(
              (item) =>
                item !== value
            )
          : [
              ...prev[type],
              value,
            ],
      };

    });

  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {

    setSearch("");

    setSuggestions([]);

    setCurrentPage(1);

    setMaxPrice(50000);

    setFilters({
      category: [],
      material: [],
      rating: 0,
      stock: "all",
      sort: "default",
    });

  };

  // ==========================================
  // FILTER LOGIC
  // ==========================================

  const filtered = useMemo(() => {

    let result = furnitureData.filter(
      (item) => {

        const matchSearch =
          (item.name || "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchCategory =
          filters.category.length === 0 ||
          filters.category.includes(
            item.category
          );

        const matchMaterial =
          filters.material.length === 0 ||
          filters.material.includes(
            item.material
          );

        const matchRating =
          Number(item.rating || 0) >=
          Number(filters.rating || 0);

        const matchPrice =
          Number(item.priceValue || 0) <=
          maxPrice;

        const matchStock =
          filters.stock === "all"
            ? true
            : filters.stock === "in"
            ? Number(item.stock || 0) > 0
            : Number(item.stock || 0) <= 0;

        return (
          matchSearch &&
          matchCategory &&
          matchMaterial &&
          matchRating &&
          matchPrice &&
          matchStock
        );

      }
    );

    // ========================================
    // SORT
    // ========================================

    switch (filters.sort) {

      case "low":

        result.sort(
          (a, b) =>
            Number(a.priceValue || 0) -
            Number(b.priceValue || 0)
        );

        break;

      case "high":

        result.sort(
          (a, b) =>
            Number(b.priceValue || 0) -
            Number(a.priceValue || 0)
        );

        break;

      case "rating":

        result.sort(
          (a, b) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        );

        break;

      default:
        break;

    }

    return result;

  }, [
    furnitureData,
    filters,
    search,
    maxPrice,
  ]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const lastIndex =
    currentPage * productsPerPage;

  const firstIndex =
    lastIndex - productsPerPage;

  const currentProducts =
    filtered.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      filtered.length /
      productsPerPage
    );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="loading-container">

        <h2>
          Loading Furniture...
        </h2>

      </div>
    );

  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div className="loading-container">

        <h2>
          {error}
        </h2>

      </div>
    );

  }

  // ==========================================
  // JSX
  // ==========================================

  return (

    <section className="layout">

      <div className="furniture-wrapper">

        {/* ==========================================
            HERO
        ========================================== */}

        <div className="furniture-hero">

          <span className="hero-tag">
            PREMIUM COLLECTION
          </span>

          <h1>
            Modern
            <span> Furniture</span>
          </h1>

          <p>
            Discover luxury furniture crafted
            for modern homes, villas, offices
            and commercial spaces.
          </p>

        </div>

        <div className="content-layout">

          {/* ==========================================
              SIDEBAR
          ========================================== */}

          <aside className="sidebar">

            <h2 className="title">
              <FaSlidersH />
              <span>Filters</span>
            </h2>

            {/* CATEGORY */}

            <div className="filter-block">

              <h4>
                Category
              </h4>

              <div className="filter-chip-group">

                {categories.map((category) => (

                  <button
                    type="button"
                    key={category}
                    className={
                      `filter-chip ${
                        filters.category.includes(
                          category
                        )
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={() =>
                      toggleFilter(
                        "category",
                        category
                      )
                    }
                  >
                    {category}
                  </button>

                ))}

              </div>

            </div>

            {/* MATERIAL */}

            <div className="filter-block">

              <h4>
                Material
              </h4>

              <div className="filter-chip-group">

                {materials.map((material) => (

                  <button
                    type="button"
                    key={material}
                    className={
                      `filter-chip ${
                        filters.material.includes(
                          material
                        )
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={() =>
                      toggleFilter(
                        "material",
                        material
                      )
                    }
                  >
                    {material}
                  </button>

                ))}

              </div>

            </div>

            {/* RATING */}

            <div className="filter-block">

              <h4>
                Rating
              </h4>

              <select
                className="dropdown"
                value={filters.rating}
                onChange={(e) => {

                  setCurrentPage(1);

                  setFilters({
                    ...filters,
                    rating:
                      Number(
                        e.target.value
                      ),
                  });

                }}
              >

                <option value={0}>
                  All
                </option>

                <option value={4}>
                  4★+
                </option>

                <option value={3}>
                  3★+
                </option>

              </select>

            </div>

            {/* PRICE */}

            <div className="filter-block">

              <h4>
                Price
              </h4>

              <div className="price-labels">

                <span>
                  ₹0
                </span>

                <span>
                  ₹
                  {maxPrice.toLocaleString()}
                </span>

              </div>

              <input
                type="range"
                min="0"
                max="50000"
                value={maxPrice}
                style={{
                  "--range-progress": `${
                    (maxPrice / 50000) * 100
                  }%`,
                }}
                onChange={(e) => {

                  setCurrentPage(1);

                  setMaxPrice(
                    Number(
                      e.target.value
                    )
                  );

                }}
              />

            </div>

            {/* STOCK */}

            <div className="filter-block">

              <h4>
                Stock
              </h4>

              <select
                className="dropdown"
                value={filters.stock}
                onChange={(e) => {

                  setCurrentPage(1);

                  setFilters({
                    ...filters,
                    stock:
                      e.target.value,
                  });

                }}
              >

                <option value="all">
                  All
                </option>

                <option value="in">
                  In Stock
                </option>

                <option value="out">
                  Out of Stock
                </option>

              </select>

            </div>

            {/* SORT */}

            <div className="filter-block">

              <h4>
                Sort By
              </h4>

              <select
                className="dropdown"
                value={filters.sort}
                onChange={(e) => {

                  setCurrentPage(1);

                  setFilters({
                    ...filters,
                    sort:
                      e.target.value,
                  });

                }}
              >

                <option value="default">
                  Default
                </option>

                <option value="low">
                  Price : Low → High
                </option>

                <option value="high">
                  Price : High → Low
                </option>

                <option value="rating">
                  Top Rated
                </option>

              </select>

            </div>

            <button
              type="button"
              className="clear-btn"
              onClick={clearFilters}
            >
              Reset Filters
            </button>

          </aside>

          {/* ==========================================
              MAIN
          ========================================== */}

          <div className="main">

            <div className="result-bar">

              <div>

                <h2>
                  Modern Furniture
                </h2>

                <p className="product-count">
                  {filtered.length} Products Available
                </p>

              </div>

              {/* SEARCH */}

              <div className="search-box">

                <FaSearch />

                <input
                  type="text"
                  placeholder="Search Furniture..."
                  value={search}
                  onChange={(e) => {

                    setSearch(
                      e.target.value
                    );

                    setCurrentPage(
                      1
                    );

                  }}
                />

                {/* SEARCH SUGGESTIONS */}

                {suggestions.length > 0 && (

                  <div className="search-suggestions">

                    {suggestions.map(
                      (item) => (

                        <div
                          key={item._id}
                          className="suggestion-item"
                          onClick={() => {

                            navigate(
                              `/product/${item._id}`
                            );

                            setSuggestions(
                              []
                            );

                            setSearch(
                              ""
                            );

                          }}
                        >

                          <img
                            src={getImageUrl(
                              item.image
                            )}
                            alt={item.name}
                          />

                          <div>

                            <p>
                              {item.name}
                            </p>

                            <span>
                              ₹
                              {Number(
                                item.priceValue ||
                                0
                              ).toLocaleString()}
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

            {/* ==========================================
                PRODUCT GRID
            ========================================== */}

            <div className="grid">

              {currentProducts.length === 0 ? (

                <div className="no-result">

                  <h2>
                    No Products Found
                  </h2>

                  <p>
                    Try changing filters
                    or search.
                  </p>

                </div>

              ) : (

                currentProducts.map(
                  (item, index) => (

                    <motion.div
                      className="card"
                      key={item._id}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(
                          (index % 6) * 0.06,
                          0.3
                        ),
                      }}
                    >

                      {/* IMAGE */}

                      <div className="img-box">

                        {Array.isArray(
                          item.tags
                        ) &&
                          item.tags.length >
                            0 && (

                          <div className="badge-group">

                            {item.tags.map(
                              (tag) => (

                                <span
                                  className="badge"
                                  key={tag}
                                >
                                  {tag}
                                </span>

                              )
                            )}

                          </div>

                        )}

                        <div className="img-actions">

                          <button
                            type="button"
                            className={
                              `wishlist ${
                                isWishlisted(
                                  item._id
                                )
                                  ? "active"
                                  : ""
                              }`
                            }
                            onClick={() =>
                              toggleWishlist(
                                item
                              )
                            }
                            title={
                              isWishlisted(
                                item._id
                              )
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            }
                          >

                            {isWishlisted(
                              item._id
                            )
                              ? (
                                <FaHeart />
                              )
                              : (
                                <FaRegHeart />
                              )}

                          </button>

                          <button
                            type="button"
                            className="quick-view"
                            title="View Details"
                            onClick={() =>
                              navigate(
                                `/product/${item._id}`
                              )
                            }
                          >
                            <FaEye />
                          </button>

                        </div>

                        {Number(
                          item.stock || 0
                        ) <= 5 &&
                          Number(
                            item.stock || 0
                          ) > 0 && (

                          <span className="stock-badge">
                            Only{" "}
                            {item.stock}{" "}
                            left
                          </span>

                        )}

                        <img
                          src={getImageUrl(
                            item.image
                          )}
                          alt={item.name}
                          loading="lazy"
                          onClick={() =>
                            navigate(
                              `/product/${item._id}`
                            )
                          }
                          onError={(e) => {
                            e.currentTarget.style.opacity =
                              "0.3";
                          }}
                        />

                      </div>

                      {/* CONTENT */}

                      <div className="content">

                        <div className="content-meta">

                          <span className="category-chip">
                            {item.category}
                          </span>

                          <span className="rating-chip">
                            ★{" "}
                            {Number(
                              item.rating ||
                              0
                            ).toFixed(1)}
                          </span>

                        </div>

                        <h3
                          onClick={() =>
                            navigate(
                              `/product/${item._id}`
                            )
                          }
                        >
                          {item.name}
                        </h3>

                        <div className="price-row">

                          <p className="price">
                            ₹
                            {Number(
                              item.priceValue ||
                              0
                            ).toLocaleString()}
                          </p>

                          {!user ? (

                            <button
                              type="button"
                              className="add-cart-chip"
                              onClick={() =>
                                toast.error(
                                  "You need to be logged in to add items to the cart."
                                )
                              }
                            >
                              <FaShoppingBag />
                              <span>Add</span>
                            </button>

                          ) : getItemQuantity(item._id) > 0 ? (

                            <div className="cart-chip-stepper">

                              <button
                                type="button"
                                onClick={() => decreaseQuantity(item)}
                                title={
                                  getItemQuantity(item._id) === 1
                                    ? "Remove from cart"
                                    : "Decrease quantity"
                                }
                              >
                                <FaMinus />
                              </button>

                              <span>
                                {getItemQuantity(item._id)}
                              </span>

                              <button
                                type="button"
                                onClick={() => increaseQuantity(item)}
                                title={
                                  getItemQuantity(item._id) >=
                                  Number(item.stock || 0)
                                    ? "No more stock available"
                                    : "Increase quantity"
                                }
                                disabled={
                                  getItemQuantity(item._id) >=
                                  Number(item.stock || 0)
                                }
                              >
                                <FaPlus />
                              </button>

                            </div>

                          ) : Number(item.stock || 0) <= 0 ? (

                            <button
                              type="button"
                              className="add-cart-chip"
                              disabled
                            >
                              <span>Out of Stock</span>
                            </button>

                          ) : (

                            <button
                              type="button"
                              className="add-cart-chip"
                              onClick={() => addToCart(item)}
                            >
                              <FaShoppingBag />
                              <span>Add</span>
                            </button>

                          )}

                        </div>

                      </div>

                    </motion.div>

                  )
                )

              )}

            </div>

            {/* ==========================================
                PAGINATION
            ========================================== */}

            {totalPages > 1 && (

              <div className="pagination">

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) => (

                    <button
                      type="button"
                      key={index}
                      className={
                        currentPage ===
                        index + 1
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(
                          index + 1
                        )
                      }
                    >

                      {index + 1}

                    </button>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </section>

  );

}

export default FurnitureGallery;