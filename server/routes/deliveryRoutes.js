import express from "express";
import DeliveryZone from "../models/DeliveryZone.js";

const router = express.Router();

router.get("/check/:pincode", async (req, res) => {
  try {
    const zone = await DeliveryZone.findOne({ pincode: req.params.pincode.trim() });

    if (!zone || !zone.available) {
      return res.json({ available: false, message: "Delivery is currently unavailable for this PIN code." });
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + zone.deliveryDays);

    res.json({
      available: true,
      city: zone.city,
      state: zone.state,
      deliveryDays: zone.deliveryDays,
      deliveryCharge: zone.deliveryCharge,
      estimatedDate,
    });
  } catch (error) {
    console.error("Delivery check error:", error);
    res.status(500).json({ message: "Unable to check delivery" });
  }
});

export default router;
