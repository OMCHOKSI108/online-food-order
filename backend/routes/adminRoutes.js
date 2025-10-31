import express from "express";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Payment from "../models/Payment.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// 👑 ADMIN - GET ALL USERS
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const statistics = {
      totalUsers: users.length,
      customers: users.filter(u => u.role === "customer").length,
      restaurants: users.filter(u => u.role === "restaurant").length,
      admins: users.filter(u => u.role === "admin").length
    };
    res.json({ users, statistics });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// 👑 ADMIN - DELETE USER
router.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// 👑 ADMIN - EDIT USER
router.put("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, phone, address, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, isActive },
      { new: true }
    ).select("-password");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// 👑 ADMIN - GET ALL PENDING RESTAURANTS
router.get("/restaurants/pending", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approvalStatus: "pending" }).populate("owner", "-password");
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

// 👑 ADMIN - APPROVE RESTAURANT
router.put("/restaurants/:id/approve", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "approved" },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    
    res.json({ message: "Restaurant approved", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error approving restaurant" });
  }
});

// 👑 ADMIN - REJECT RESTAURANT
router.put("/restaurants/:id/reject", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "rejected", rejectionReason },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    
    res.json({ message: "Restaurant rejected", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting restaurant" });
  }
});

// 👑 ADMIN - GET ALL ORDERS
router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("restaurant", "name")
      .populate("items.foodItem", "name price");
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// 👑 ADMIN - GET ALL PAYMENTS
router.get("/payments", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("order", "totalAmount status");
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments" });
  }
});

// 👑 ADMIN - GET REVENUE REPORT
router.get("/reports/revenue", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ status: "delivered", paymentStatus: "completed" });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const restaurantRevenue = {};
    for (let order of orders) {
      const restaurantId = order.restaurant.toString();
      restaurantRevenue[restaurantId] = (restaurantRevenue[restaurantId] || 0) + order.totalAmount;
    }

    const restaurants = await Restaurant.find();
    const revenueByRestaurant = restaurants.map(r => ({
      name: r.name,
      revenue: restaurantRevenue[r._id.toString()] || 0,
      totalOrders: orders.filter(o => o.restaurant.toString() === r._id.toString()).length
    }));

    res.json({
      totalRevenue,
      currency: "₹",
      revenueByRestaurant,
      totalOrders: orders.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
});

// 👑 ADMIN - GET TOP RESTAURANTS REPORT
router.get("/reports/top-restaurants", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approvalStatus: "approved" }).sort({ totalOrders: -1 }).limit(10);
    
    res.json({
      topRestaurants: restaurants.map(r => ({
        name: r.name,
        totalOrders: r.totalOrders,
        totalEarnings: `₹${r.totalEarnings}`,
        rating: r.rating
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
});

// 👑 ADMIN - GET TOP DISHES REPORT
router.get("/reports/top-dishes", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ status: "delivered" }).populate("items.foodItem");
    
    const dishStats = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const dishId = item.foodItem._id.toString();
        if (!dishStats[dishId]) {
          dishStats[dishId] = { name: item.foodItem.name, orders: 0, revenue: 0 };
        }
        dishStats[dishId].orders += item.quantity;
        dishStats[dishId].revenue += item.price * item.quantity;
      });
    });

    const topDishes = Object.values(dishStats)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 10)
      .map(d => ({
        name: d.name,
        totalOrders: d.orders,
        revenue: `₹${d.revenue}`
      }));

    res.json({ topDishes });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
});

// 👑 ADMIN - GET OVERALL STATISTICS
router.get("/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const restaurants = await Restaurant.find();
    const orders = await Order.find();
    const payments = await Payment.find();

    const totalRevenue = orders
      .filter(o => o.paymentStatus === "completed")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const stats = {
      totalUsers: users.length,
      totalCustomers: users.filter(u => u.role === "customer").length,
      totalRestaurants: restaurants.length,
      approvedRestaurants: restaurants.filter(r => r.approvalStatus === "approved").length,
      totalOrders: orders.length,
      deliveredOrders: orders.filter(o => o.status === "delivered").length,
      totalRevenue: `₹${totalRevenue}`,
      successfulPayments: payments.filter(p => p.status === "success").length,
      failedPayments: payments.filter(p => p.status === "failed").length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

export default router;
