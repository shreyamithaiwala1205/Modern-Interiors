import express from "express";
import Furniture from "../models/Furniture.js";
import Order from "../models/Order.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", auth, adminOnly, async (req, res) => {
  try {
    const lowStock = await Furniture.find({
      stock: { $gt: 0, $lte: 5 },
      isVisible: true,
    }).select("name stock image category").sort({ stock: 1 });

    const [sales] = await Order.aggregate([
      { $match: { "payment.status": "Paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          paidOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$totalPrice" },
        },
      },
    ]);

    const statusDistribution = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const topProducts = await Order.aggregate([
      { $match: { "payment.status": "Paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.furniture",
          name: { $first: "$items.name" },
          unitsSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalRevenue: sales?.totalRevenue || 0,
      paidOrders: sales?.paidOrders || 0,
      averageOrderValue: Math.round(sales?.averageOrderValue || 0),
      lowStock,
      statusDistribution,
      topProducts,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ message: "Unable to load analytics" });
  }
});

export default router;
