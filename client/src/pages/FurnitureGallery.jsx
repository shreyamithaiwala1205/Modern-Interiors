import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaEye,
} from "react-icons/fa";

import getImageUrl from "../utils/imageUrl";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import "../css/Furniture.css";

function FurnitureGallery() {

  const navigate = useNavigate();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const {
    addToCart,
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
              Filters
            </h2>

            {/* CATEGORY */}

            <div className="filter-block">

              <h4>
                Category
              </h4>

              {categories.map((category) => (

                <label key={category}>

                  <input
                    type="checkbox"
                    checked={
                      filters.category.includes(
                        category
                      )
                    }
                    onChange={() =>
                      toggleFilter(
                        "category",
                        category
                      )
                    }
                  />

                  {category}

                </label>

              ))}

            </div>

            {/* MATERIAL */}

            <div className="filter-block">

              <h4>
                Material
              </h4>

              {materials.map((material) => (

                <label key={material}>

                  <input
                    type="checkbox"
                    checked={
                      filters.material.includes(
                        material
                      )
                    }
                    onChange={() =>
                      toggleFilter(
                        "material",
                        material
                      )
                    }
                  />

                  {material}

                </label>

              ))}

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
                  (item) => (

                    <div
                      className="card"
                      key={item._id}
                    >

                      {/* IMAGE */}

                      <div className="img-box">

                        <span className="badge">

                          {Number(
                            item.rating || 0
                          ) >= 4.7
                            ? "BEST SELLER"
                            : Number(
                                item.rating || 0
                              ) >= 4.3
                            ? "POPULAR"
                            : "NEW"}

                        </span>

                        <button
                          type="button"
                          className="wishlist"
                          onClick={() =>
                            toggleWishlist(
                              item
                            )
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

                        <img
                          src={getImageUrl(
                            item.image
                          )}
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.opacity =
                              "0.3";
                          }}
                        />

                      </div>

                      {/* CONTENT */}

                      <div className="content">

                        <h3>
                          {item.name}
                        </h3>

                        <p className="price">
                          ₹
                          {Number(
                            item.priceValue ||
                            0
                          ).toLocaleString()}
                        </p>

                        {/* FIXED VIEW DETAILS */}

                        <button
                          type="button"
                          className="furniture-view-btn"
                          onClick={() =>
                            navigate(
                              `/product/${item._id}`
                            )
                          }
                        >

                          <span>
                            View Details
                          </span>

                          <FaEye />

                        </button>

                        {/* CART */}

                        <button
                          type="button"
                          className="cart-btn"
                          onClick={() =>
                            addToCart(
                              item
                            )
                          }
                        >

                          Add To Cart

                        </button>

                      </div>

                    </div>

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