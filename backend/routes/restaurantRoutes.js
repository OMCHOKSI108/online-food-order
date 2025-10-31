import express from "express";
import Restaurant from "../models/Restaurant.js";
import FoodItem from "../models/FoodItem.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import { verifyToken, verifyRestaurant } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC - Get all approved restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approvalStatus: "approved", isActive: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

// PUBLIC - Get menu for a restaurant
router.get("/:id/menu", async (req, res) => {
  try {
    const items = await FoodItem.find({ restaurant: req.params.id, isAvailable: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// 🍴 RESTAURANT - REGISTER RESTAURANT
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { name, description, address, image } = req.body;

    // Only restaurant users can register restaurant
    const user = await User.findById(req.user.id);
    if (user.role !== "restaurant") {
      return res.status(403).json({ message: "Only restaurant users can register a restaurant" });
    }

    const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });
    if (existingRestaurant) {
      return res.status(400).json({ message: "You already have a restaurant" });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      image,
      owner: req.user.id,
      approvalStatus: "pending"
    });

    // Link restaurant to user
    await User.findByIdAndUpdate(req.user.id, { restaurantId: restaurant._id });

    res.status(201).json({ 
      message: "Restaurant registered successfully. Awaiting admin approval.", 
      restaurant 
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering restaurant", error: error.message });
  }
});

// 🍴 RESTAURANT - GET MY RESTAURANT
router.get("/my-restaurant", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant" });
  }
});

// 🍴 RESTAURANT - UPDATE RESTAURANT INFO
router.put("/my-restaurant", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const { name, description, address, image } = req.body;
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user.id },
      { name, description, address, image },
      { new: true }
    );

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json({ message: "Restaurant updated", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error updating restaurant" });
  }
});

// 🍴 RESTAURANT - CREATE FOOD ITEM
router.post("/menu", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const { name, description, price, image, category, preparationTime } = req.body;

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const foodItem = await FoodItem.create({
      name,
      description,
      price, // in INR
      image,
      category,
      restaurant: restaurant._id,
      preparationTime
    });

    res.status(201).json({ message: "Food item added to menu", foodItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding food item", error: error.message });
  }
});

// 🍴 RESTAURANT - GET MY MENU
router.get("/menu", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const foodItems = await FoodItem.find({ restaurant: restaurant._id });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// 🍴 RESTAURANT - UPDATE FOOD ITEM
router.put("/menu/:id", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const { name, description, price, image, category, isAvailable, preparationTime } = req.body;

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const foodItem = await FoodItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: restaurant._id },
      { name, description, price, image, category, isAvailable, preparationTime },
      { new: true }
    );

    if (!foodItem) return res.status(404).json({ message: "Food item not found" });
    res.json({ message: "Food item updated", foodItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating food item" });
  }
});

// 🍴 RESTAURANT - DELETE FOOD ITEM
router.delete("/menu/:id", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const foodItem = await FoodItem.findOneAndDelete({ _id: req.params.id, restaurant: restaurant._id });
    if (!foodItem) return res.status(404).json({ message: "Food item not found" });

    res.json({ message: "Food item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting food item" });
  }
});

// 🍴 RESTAURANT - GET INCOMING ORDERS
router.get("/orders", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("user", "name phone email address")
      .populate("items.foodItem", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// 🍴 RESTAURANT - ACCEPT ORDER
router.put("/orders/:id/accept", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurant: restaurant._id, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found or already processed" });
    res.json({ message: "Order accepted", order });
  } catch (error) {
    res.status(500).json({ message: "Error accepting order" });
  }
});

// 🍴 RESTAURANT - REJECT ORDER
router.put("/orders/:id/reject", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurant: restaurant._id, status: "pending" },
      { status: "rejected", rejectionReason },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found or already processed" });
    res.json({ message: "Order rejected", order });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting order" });
  }
});

// 🍴 RESTAURANT - UPDATE ORDER STATUS
router.put("/orders/:id/status", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["preparing", "ready", "out_for_delivery", "delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurant: restaurant._id },
      { status, deliveredAt: status === "delivered" ? new Date() : undefined },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

// 🍴 RESTAURANT - GET CUSTOMER FEEDBACK
router.get("/feedback", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const reviews = await Review.find({ restaurant: restaurant._id })
      .populate("customer", "name email")
      .populate("foodItem", "name")
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ reviews, averageRating: avgRating });
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// 🍴 RESTAURANT - GET EARNINGS
router.get("/earnings", verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const orders = await Order.find({ 
      restaurant: restaurant._id, 
      status: "delivered",
      paymentStatus: "completed"
    });

    const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;

    res.json({
      totalEarnings: `₹${totalEarnings}`,
      totalOrders,
      averageOrderValue: `₹${totalOrders > 0 ? (totalEarnings / totalOrders).toFixed(2) : 0}`
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching earnings" });
  }
});

export default router;
