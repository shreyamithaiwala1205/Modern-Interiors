import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const initial = { room: "", style: "", material: "", maxBudget: 100000 };

export default function StyleFinder() {
  const [preferences, setPreferences] = useState(initial);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const findFurniture = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/style-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) throw new Error("Recommendation request failed");
      setProducts(await response.json());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Find Your Interior Style</h1>
      <div className="style-finder-form">
        <select value={preferences.room} onChange={(e) => setPreferences({...preferences, room:e.target.value})}>
          <option value="">Select room</option>
          <option value="living room">Living Room</option>
          <option value="bedroom">Bedroom</option>
          <option value="dining room">Dining Room</option>
          <option value="office">Office</option>
        </select>
        <select value={preferences.style} onChange={(e) => setPreferences({...preferences, style:e.target.value})}>
          <option value="">Select style</option>
          <option value="modern">Modern</option>
          <option value="minimal">Minimal</option>
          <option value="luxury">Luxury</option>
          <option value="contemporary">Contemporary</option>
          <option value="traditional">Traditional</option>
        </select>
        <select value={preferences.material} onChange={(e) => setPreferences({...preferences, material:e.target.value})}>
          <option value="">Any material</option>
          <option value="wood">Wood</option>
          <option value="metal">Metal</option>
          <option value="fabric">Fabric</option>
          <option value="leather">Leather</option>
          <option value="glass">Glass</option>
        </select>
        <input type="number" min="1000" value={preferences.maxBudget}
          onChange={(e) => setPreferences({...preferences, maxBudget:e.target.value})} />
        <button onClick={findFurniture} disabled={loading}>
          {loading ? "Finding..." : "Show My Collection"}
        </button>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <motion.a initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            href={`/furniture/${product._id}`} key={product._id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{Number(product.priceValue).toLocaleString("en-IN")}</p>
          </motion.a>
        ))}
      </div>
    </main>
  );
}
