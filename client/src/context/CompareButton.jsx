import { Scale } from "lucide-react";
import { useCompare } from "../../context/CompareContext";

export default function CompareButton({ product }) {
  const { addToCompare } = useCompare();

  return (
    <button className="luxury-outline-btn" onClick={() => addToCompare(product)}>
      <Scale size={18} /> Compare
    </button>
  );
}
