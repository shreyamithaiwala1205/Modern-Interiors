import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

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

      setWishlist(response.data.wishlist || []);

    } catch (error) {

      console.log(error);

    }

  };

  // ===============================
  // Load Wishlist
  // ===============================

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  // ===============================
  // Add / Remove Wishlist
  // ===============================

  const toggleWishlist = async (product) => {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to manage your wishlist.");
      return;
    }

    try {

      const existingEntry = wishlist.find(
        (item) => item.furniture?._id === product._id
      );

      if (existingEntry) {

        await axios.delete(
          `http://localhost:5000/api/wishlist/${existingEntry._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(`${product.name || "Item"} removed from wishlist.`);

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

        toast.success(`${product.name || "Item"} added to wishlist!`);

      }

      await fetchWishlist();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to update wishlist. Please try again."
      );

    }

  };

  // ===============================
  // Remove Wishlist (by wishlist entry id)
  // ===============================

  const removeWishlist = async (entryId) => {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to manage your wishlist.");
      return;
    }

    try {

      await axios.delete(
        `http://localhost:5000/api/wishlist/${entryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Item removed from wishlist.");

      await fetchWishlist();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to remove item from wishlist."
      );

    }

  };

  // ===============================
  // Check Wishlist
  // ===============================

  const isWishlisted = (id) => {

    return wishlist.some(
      (item) => item.furniture?._id === id
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