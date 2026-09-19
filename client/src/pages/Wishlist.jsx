import React from "react";
import { Link } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductImage from "../components/ProductImage";

import {
  FaHeart,
  FaTrash,
  FaEye,
  FaShoppingCart,
} from "react-icons/fa";

import "../css/Wishlist.css";

function Wishlist() {

  const {
    wishlist,
    removeWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  return (
    <section className="wishlist-page">

      <div className="wishlist-header">

        <h1>
          My Wishlist
        </h1>

        <p>
          Save your favorite luxury furniture for future purchase.
        </p>

      </div>

      {wishlist.length === 0 ? (

        <div className="empty-wishlist">

          <FaHeart className="empty-icon" />

          <h2>
            Your Wishlist is Empty
          </h2>

          <p>
            Start exploring our premium furniture collection and add your favourite products.
          </p>

          <Link
            to="/furniture"
            className="shop-btn"
          >
            Explore Furniture
          </Link>

        </div>

      ) : (

        <div className="wishlist-grid">

          {wishlist.map((entry) => {

            const item = entry.furniture;
            const unavailable =
              !item || item.isVisible === false;

            return (

            <div
              className="wishlist-card"
              key={entry._id}
            >

              <div className="wishlist-image">

                <ProductImage
                  image={item?.image}
                  alt={item?.name || "Unavailable product"}
                  unavailable={unavailable}
                />

              </div>

              <div className="wishlist-content">

                <h2>
                  {item?.name || "Product Unavailable"}
                </h2>

                {unavailable ? (

                  <p className="unavailable-label">
                    Product no longer available
                  </p>

                ) : (

                  <>

                    <h3>
                      ₹
                      {Number(
                        item.priceValue || 0
                      ).toLocaleString()}
                    </h3>

                    <div className="wishlist-rating">

                      {"★".repeat(
                        Math.floor(
                          Number(
                            item.rating || 0
                          )
                        )
                      )}

                      {"☆".repeat(
                        Math.max(
                          0,
                          5 -
                            Math.floor(
                              Number(
                                item.rating || 0
                              )
                            )
                        )
                      )}

                      <span>
                        ({item.rating || 0})
                      </span>

                    </div>

                  </>

                )}

                <div className="wishlist-buttons">

                  {!unavailable && (

                    <>

                      <Link
                        to={`/product/${item._id}`}
                        className="view-btn"
                      >

                        <FaEye />

                        <span>
                          View Details
                        </span>

                      </Link>

                      <button
                        className="cart-btn"
                        onClick={() => addToCart(item)}
                      >

                        <FaShoppingCart />

                        <span>
                          Add To Cart
                        </span>

                      </button>

                    </>

                  )}

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeWishlist(
                        entry._id
                      )
                    }
                  >

                    <FaTrash />

                    <span>
                      Remove
                    </span>

                  </button>

                </div>

              </div>

            </div>

            );

          })}

        </div>

      )}

    </section>
  );
}

export default Wishlist;