import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState([]);

  const addToCompare = (product) => {
    if (compareItems.some((item) => item._id === product._id)) {
      toast("Product already added to compare");
      return;
    }
    if (compareItems.length >= 3) {
      toast.error("You can compare up to 3 products");
      return;
    }
    setCompareItems((prev) => [...prev, product]);
  };

  const removeFromCompare = (id) =>
    setCompareItems((prev) => prev.filter((item) => item._id !== id));

  const clearCompare = () => setCompareItems([]);

  const value = useMemo(
    () => ({ compareItems, addToCompare, removeFromCompare, clearCompare }),
    [compareItems]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export const useCompare = () => useContext(CompareContext);
