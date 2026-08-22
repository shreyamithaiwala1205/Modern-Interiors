import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  // Get Latest Token
  const getToken = () => localStorage.getItem("token");

  // ===========================
  // Fetch Cart
  // ===========================

const fetchCart = async () => {

  const token = getToken();

  if (!token) {
    setCart([]);
    return;
  }

  try {

    const res = await axios.get(
      "http://localhost:5000/api/cart",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCart(res.data.cart);

  } catch (error) {
    console.log(error);
  }

};

useEffect(() => {
  fetchCart();
}, []);

  // ===========================
  // Add To Cart
  // ===========================

  const addToCart = async (item) => {

    const token = getToken();

    if (!token) {
      alert("Please Login First");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/api/cart",
        {
          furnitureId: item._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();

      alert("Added To Cart");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable To Add Cart"
      );
    }

  };

  // ===========================
  // Remove From Cart
  // ===========================

  const removeFromCart = async (id) => {

    const token = getToken();

    if (!token) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable To Remove Item"
      );
    }

  };

  return (

    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
      }}
    >

      {children}

    </CartContext.Provider>

  );

};

export const useCart = () => useContext(CartContext);