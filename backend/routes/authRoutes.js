import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ REGISTER - Support all three roles
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Validate role
    if (!["customer", "restaurant", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      role,
      phone,
      address
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ PROFILE (GET USER INFO)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// ✅ UPDATE PROFILE
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ✅ GET USER STATISTICS
router.get("/me/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's orders with populated data
    const orders = await Order.find({ user: userId })
      .populate('restaurant', 'name address')
      .populate('items.foodItem', 'name price')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get unique restaurants visited
    const uniqueRestaurants = [...new Set(orders.map(order => order.restaurant?._id?.toString()).filter(Boolean))];
    const restaurantsVisited = uniqueRestaurants.length;

    // Get recent deliveries (last 5)
    const recentDeliveries = orders.slice(0, 5).map(order => ({
      id: order._id,
      restaurantName: order.restaurant?.name || 'Unknown Restaurant',
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      deliveryAddress: order.deliveryAddress
    }));

    // Calculate average delivery time (mock for now - in real app would track actual times)
    const avgDeliveryTime = totalOrders > 0 ? Math.floor(Math.random() * 20) + 15 : 0; // 15-35 minutes

    // Get favorite restaurant (most ordered from)
    const restaurantCounts = {};
    orders.forEach(order => {
      if (order.restaurant?._id) {
        const restaurantId = order.restaurant._id.toString();
        restaurantCounts[restaurantId] = (restaurantCounts[restaurantId] || 0) + 1;
      }
    });

    const favoriteRestaurantId = Object.keys(restaurantCounts).reduce((a, b) =>
      restaurantCounts[a] > restaurantCounts[b] ? a : b, null
    );

    let favoriteRestaurant = null;
    if (favoriteRestaurantId) {
      const favOrder = orders.find(order => order.restaurant?._id?.toString() === favoriteRestaurantId);
      favoriteRestaurant = favOrder?.restaurant;
    }

    // Get membership level based on total spent
    let membershipLevel = 'Bronze';
    if (totalSpent > 5000) membershipLevel = 'Gold';
    else if (totalSpent > 2000) membershipLevel = 'Silver';

    const stats = {
      totalOrders,
      totalSpent,
      restaurantsVisited,
      avgDeliveryTime,
      membershipLevel,
      recentDeliveries,
      favoriteRestaurant: favoriteRestaurant ? {
        name: favoriteRestaurant.name,
        address: favoriteRestaurant.address
      } : null,
      savedAddresses: 1, // For now, just count if user has an address
      lastOrderDate: orders.length > 0 ? orders[0].createdAt : null
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: "Error fetching statistics", error: error.message });
  }
});

export default router;
