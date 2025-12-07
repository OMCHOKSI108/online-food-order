import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [
    {
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    },
  ],
  totalAmount: { type: Number, required: true }, // in INR
  deliveryAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"], 
    default: "pending" 
  },
  paymentStatus: { type: String, enum: ["pending", "completed", "failed", "refunded", "cod"], default: "pending" },
  paymentMethod: { type: String, enum: ["card", "upi", "wallet"], default: "card" },
  paymentId: String,
  refundAmount: { type: Number, default: 0 },
  refundStatus: { type: String, enum: ["none", "initiated", "completed"], default: "none" },
  rejectionReason: String,
  customerFeedback: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: Date
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
