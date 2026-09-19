import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Get Latest Token
  const getToken = () => localStorage.getItem("token");

  // ===========================
  // Fetch Cart
  // ===========================
  const fetchCart = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setCart([]);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data.cart || []);
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user, fetchCart]);

  // ===========================
  // Add To Cart
  // ===========================
  const addToCart = async (item) => {
    const token = getToken();

    if (!token) {
      toast.error("Please log in to add items to your cart.");
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

      await fetchCart();
      toast.success(`${item.name || "Item"} added to cart!`);
    } catch (error) {
      console.error("Add To Cart Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to add item to cart. Please try again."
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
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart();
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Remove From Cart Error:", error);
      toast.error(
        error.response?.data?.message || "Unable to remove item from cart."
      );
    }
  };

  // ===========================
  // Update Cart Item Quantity
  // ===========================
  const updateQuantity = async (cartItemId, newQuantity) => {
    const token = getToken();
    if (!token) return;

    if (newQuantity <= 0) {
      return removeFromCart(cartItemId);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/cart/${cartItemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
    } catch (error) {
      console.error("Update Quantity Error:", error);
      toast.error(
        error.response?.data?.message || "Unable to update quantity."
      );
    }
  };

  // ===========================
  // Increase Quantity (by item object or id)
  // ===========================
  const increaseQuantity = async (item) => {
    const itemId = item._id || item;
    const existingCartItem = cart.find(
      (c) => (c.furniture?._id || c.furniture) === itemId
    );

    if (existingCartItem) {
      await updateQuantity(existingCartItem._id, existingCartItem.quantity + 1);
    } else {
      await addToCart(item);
    }
  };

  // ===========================
  // Decrease Quantity (by item object or id)
  // ===========================
  const decreaseQuantity = async (item) => {
    const itemId = item._id || item;
    const existingCartItem = cart.find(
      (c) => (c.furniture?._id || c.furniture) === itemId
    );

    if (existingCartItem) {
      if (existingCartItem.quantity > 1) {
        await updateQuantity(existingCartItem._id, existingCartItem.quantity - 1);
      } else {
        await removeFromCart(existingCartItem._id);
      }
    }
  };

  // ===========================
  // Get Quantity for a Furniture ID
  // ===========================
  const getItemQuantity = (furnitureId) => {
    if (!furnitureId || !Array.isArray(cart)) return 0;
    const existing = cart.find(
      (c) => (c.furniture?._id || c.furniture) === furnitureId
    );
    return existing ? existing.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);