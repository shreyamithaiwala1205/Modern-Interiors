import { useCompare } from "../context/CompareContext";

const rows = [
  ["Price", (p) => `₹${Number(p.priceValue || 0).toLocaleString("en-IN")}`],
  ["Material", (p) => p.material || "-"],
  ["Dimensions", (p) => p.dimensions || "-"],
  ["Warranty", (p) => p.warranty || "-"],
  ["Rating", (p) => p.rating ?? "-"],
  ["Stock", (p) => (p.stock > 0 ? `${p.stock} available` : "Out of stock")],
];

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (!compareItems.length) return <main className="container"><h1>Compare Furniture</h1><p>Add up to three products to compare.</p></main>;

  return (
    <main className="container">
      <div className="page-heading">
        <h1>Compare Furniture</h1>
        <button onClick={clearCompare}>Clear</button>
      </div>
      <div className="compare-grid">
        <div className="compare-labels">
          <strong>Feature</strong>
          {rows.map(([label]) => <div key={label}>{label}</div>)}
        </div>
        {compareItems.map((product) => (
          <div className="compare-product" key={product._id}>
            <button onClick={() => removeFromCompare(product._id)}>×</button>
            <img src={product.image} alt={product.name} />
            <strong>{product.name}</strong>
            {rows.map(([label, getValue]) => <div key={label}>{getValue(product)}</div>)}
          </div>
        ))}
      </div>
    </main>
  );
}
