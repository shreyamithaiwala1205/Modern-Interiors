import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlist, setWishlist] = useState([]);

  // ===============================
  // Fetch Wishlist
  // ===============================

  const fetchWishlist = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {

      const response = await axios.get(
        "http://localhost:5000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const products = response.data.wishlist.map(
        (item) => item.furniture
      );

      setWishlist(products);

    } catch (error) {

      console.log(error);

    }

  };

  // ===============================
  // Load Wishlist
  // ===============================

  useEffect(() => {

    fetchWishlist();

  }, []);

  // ===============================
  // Add / Remove Wishlist
  // ===============================

  const toggleWishlist = async (product) => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please Login First");
      return;
    }

    try {

      const exists = wishlist.some(
        (item) => item._id === product._id
      );

      if (exists) {

        const response = await axios.get(
          "http://localhost:5000/api/wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const wishlistItem = response.data.wishlist.find(
          (item) => item.furniture._id === product._id
        );

        if (wishlistItem) {

          await axios.delete(
            `http://localhost:5000/api/wishlist/${wishlistItem._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        }

      } else {

        await axios.post(
          "http://localhost:5000/api/wishlist",
          {
            furnitureId: product._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }

      await fetchWishlist();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Wishlist Error"
      );

    }

  };

  // ===============================
  // Remove Wishlist
  // ===============================

  const removeWishlist = async (productId) => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please Login First");
      return;
    }

    try {

      const response = await axios.get(
        "http://localhost:5000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const wishlistItem = response.data.wishlist.find(
        (item) => item.furniture._id === productId
      );

      if (wishlistItem) {

        await axios.delete(
          `http://localhost:5000/api/wishlist/${wishlistItem._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }

      await fetchWishlist();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Remove Wishlist Error"
      );

    }

  };

  // ===============================
  // Check Wishlist
  // ===============================

  const isWishlisted = (id) => {

    return wishlist.some(
      (item) => item._id === id
    );

  };

  return (

    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist,
        toggleWishlist,
        removeWishlist,
        isWishlisted,
      }}
    >

      {children}

    </WishlistContext.Provider>

  );

};

export const useWishlist = () =>
  useContext(WishlistContext);