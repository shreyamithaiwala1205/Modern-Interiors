import express from "express";
import Furniture from "../models/Furniture.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { room, style, material, maxBudget } = req.body;

    const filters = {
      isVisible: true,
      stock: { $gt: 0 },
    };

    if (maxBudget) filters.priceValue = { $lte: Number(maxBudget) };
    if (material) filters.material = new RegExp(material, "i");

    const tagMatchers = [style, room]
      .filter(Boolean)
      .map((value) => new RegExp(value, "i"));

    if (tagMatchers.length) filters.tags = { $in: tagMatchers };

    const products = await Furniture.find(filters)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(12);

    res.json(products);
  } catch (error) {
    console.error("Style finder error:", error);
    res.status(500).json({ message: "Unable to find recommendations" });
  }
});

export default router;
