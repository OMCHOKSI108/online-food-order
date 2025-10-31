import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // in INR
  paymentMethod: { type: String, enum: ["card", "upi", "wallet"], required: true },
  paymentGateway: { type: String, default: "simulated" },
  transactionId: { type: String, unique: true, required: true },
  status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
  failureReason: String,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
