import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }, // in INR
  image: String,
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  category: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  preparationTime: { type: Number, default: 30 }, // in minutes
  calories: { type: Number }, // nutritional info
  isVegetarian: { type: Boolean, default: true },
  isVegan: { type: Boolean, default: false },
  spiceLevel: { type: String, enum: ["None", "Low", "Medium", "Medium-High", "High"], default: "Medium" },
  allergens: [{ type: String }], // array of allergens
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("FoodItem", foodItemSchema);
