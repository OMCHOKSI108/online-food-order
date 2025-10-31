import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  address: { type: String, required: true },
  image: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  rejectionReason: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
