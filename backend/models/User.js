import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "restaurant", "admin"], default: "customer" },
    phone: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true },
    // For restaurant owners
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    totalEarnings: { type: Number, default: 0 },
    // For customers
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
