import mongoose from "mongoose";

const deliveryZoneSchema = new mongoose.Schema(
  {
    pincode: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true },
    deliveryDays: { type: Number, default: 7, min: 1 },
    deliveryCharge: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryZone", deliveryZoneSchema);
