import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

const router = express.Router();

// Verify token middleware
const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Place new order
router.post("/", verifyUser, async (req, res) => {
  const { items, total } = req.body;
  const newOrder = await Order.create({
    user: req.user.id,
    items,
    total,
  });
  res.status(201).json({ message: "Order placed successfully", newOrder });
});

// Get all orders for logged-in user
router.get("/", verifyUser, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.foodItem");
  res.json(orders);
});

export default router;
