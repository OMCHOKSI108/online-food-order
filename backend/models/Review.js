import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  type: { type: String, enum: ["food", "restaurant"], required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
