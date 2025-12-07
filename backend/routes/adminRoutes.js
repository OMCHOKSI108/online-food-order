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

// 👑 ADMIN - GET USER DETAILS WITH CONTRIBUTION
router.get("/users/:id/details", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Calculate contribution based on role
    let contribution = {
      totalOrders: 0,
      totalSpent: 0,
      totalEarnings: 0,
      ordersAsCustomer: [],
      ordersAsRestaurant: []
    };

    if (user.role === "customer") {
      const orders = await Order.find({ user: user._id })
        .populate("restaurant", "name")
        .sort({ createdAt: -1 });
      
      contribution.totalOrders = orders.length;
      contribution.totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      contribution.ordersAsCustomer = orders;
    } else if (user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({ owner: user._id });
      if (restaurant) {
        const orders = await Order.find({ restaurant: restaurant._id })
          .populate("user", "name")
          .sort({ createdAt: -1 });
        
        contribution.totalOrders = orders.length;
        contribution.totalEarnings = orders
          .filter(o => o.paymentStatus === "completed")
          .reduce((sum, order) => sum + order.totalAmount, 0);
        contribution.ordersAsRestaurant = orders;
      }
    }

    res.json({
      user,
      contribution,
      joinedDate: user.createdAt,
      lastActive: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
});

// 👑 ADMIN - ACTIVATE/DEACTIVATE USER
router.put("/users/:id/toggle-status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status" });
  }
});

// 👑 ADMIN - SEND NOTIFICATION TO USER
router.post("/users/:id/notify", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, message, type = "info" } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // For now, we'll just log the notification. In a real app, you'd save to a notifications collection
    console.log(`Notification sent to ${user.email}: ${title} - ${message}`);

    // You could save to a Notification model here
    // const notification = new Notification({
    //   user: user._id,
    //   title,
    //   message,
    //   type,
    //   sentBy: req.user.id
    // });
    // await notification.save();

    res.json({ message: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending notification" });
  }
});

// 👑 ADMIN - SEND NOTIFICATION TO ALL USERS
router.post("/notifications/broadcast", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, message, type = "info", targetRoles = ["customer", "restaurant"] } = req.body;
    
    const users = await User.find({ role: { $in: targetRoles }, isActive: true });
    
    // For now, we'll just log the broadcast. In a real app, you'd save notifications for each user
    console.log(`Broadcast notification sent to ${users.length} users: ${title} - ${message}`);

    res.json({ 
      message: `Notification sent to ${users.length} users successfully`,
      recipientCount: users.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error sending broadcast notification" });
  }
});

// 👑 ADMIN - GET ALL RESTAURANTS
router.get("/restaurants", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "-password");
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

// 👑 ADMIN - GET ALL PENDING RESTAURANTS
router.get("/restaurants/pending", verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log("Fetching pending restaurants for admin:", req.user);
    const restaurants = await Restaurant.find({ approvalStatus: "pending" }).populate("owner", "-password");
    console.log("Found pending restaurants:", restaurants.length);
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

// 👑 ADMIN - TOGGLE RESTAURANT ACTIVE STATUS
router.put("/restaurants/:id/toggle-status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();
    
    res.json({ 
      message: `Restaurant ${restaurant.isActive ? 'activated' : 'deactivated'} successfully`, 
      restaurant 
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling restaurant status" });
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
    
    // Calculate this month's revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthOrders = orders.filter(order => order.deliveredAt >= startOfMonth);
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const restaurantRevenue = {};
    for (let order of orders) {
      const restaurantId = order.restaurant.toString();
      restaurantRevenue[restaurantId] = (restaurantRevenue[restaurantId] || 0) + order.totalAmount;
    }

    const restaurants = await Restaurant.find();
    const byRestaurant = restaurants.map(r => ({
      restaurantName: r.name,
      orderCount: orders.filter(o => o.restaurant.toString() === r._id.toString()).length,
      revenue: restaurantRevenue[r._id.toString()] || 0
    })).filter(r => r.revenue > 0); // Only show restaurants with revenue

    res.json({
      totalRevenue,
      thisMonthRevenue,
      avgOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
      currency: "₹",
      byRestaurant,
      totalOrders: orders.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
});

// 👑 ADMIN - GET TOP RESTAURANTS REPORT
router.get("/reports/top-restaurants", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ status: "delivered", paymentStatus: "completed" });
    
    const restaurantStats = {};
    orders.forEach(order => {
      const restaurantId = order.restaurant.toString();
      if (!restaurantStats[restaurantId]) {
        restaurantStats[restaurantId] = { totalOrders: 0, totalEarnings: 0 };
      }
      restaurantStats[restaurantId].totalOrders += 1;
      restaurantStats[restaurantId].totalEarnings += order.totalAmount;
    });

    const restaurants = await Restaurant.find({ approvalStatus: "approved" });
    const topRestaurants = restaurants
      .map(r => ({
        name: r.name,
        totalOrders: restaurantStats[r._id.toString()]?.totalOrders || 0,
        totalEarnings: restaurantStats[r._id.toString()]?.totalEarnings || 0,
        rating: r.rating || 0
      }))
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 10);
    
    res.json({ topRestaurants });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
});

// 👑 ADMIN - GET TOP DISHES REPORT
router.get("/reports/top-dishes", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ status: "delivered" }).populate("items.foodItem").populate("restaurant");
    
    const dishStats = {};
    orders.forEach(order => {
      const restaurantName = order.restaurant?.name || "Unknown Restaurant";
      order.items.forEach(item => {
        const dishId = item.foodItem._id.toString();
        if (!dishStats[dishId]) {
          dishStats[dishId] = { 
            name: item.foodItem.name, 
            restaurant: restaurantName,
            orders: 0, 
            revenue: 0,
            rating: item.foodItem.rating || 0
          };
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
        restaurant: d.restaurant,
        totalOrders: d.orders,
        revenue: d.revenue,
        rating: d.rating
      }));

    res.json({ topDishes });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
});

// 👑 ADMIN - GET OVERALL STATISTICS
router.get("/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log("Admin stats requested by user:", req.user);
    const users = await User.find();
    const restaurants = await Restaurant.find();
    const orders = await Order.find();
    const payments = await Payment.find();

    console.log("Found users:", users.length, "restaurants:", restaurants.length, "orders:", orders.length);

    const totalRevenue = orders
      .filter(o => o.paymentStatus === "completed")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Calculate monthly stats (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newUsersThisMonth = users.filter(u => new Date(u.createdAt) >= startOfMonth).length;
    const newRestaurantsThisMonth = restaurants.filter(r => new Date(r.createdAt) >= startOfMonth).length;
    const completedOrdersThisMonth = orders.filter(o => o.status === "delivered" && new Date(o.createdAt) >= startOfMonth).length;
    const revenueThisMonth = orders
      .filter(o => o.paymentStatus === "completed" && new Date(o.createdAt) >= startOfMonth)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingRestaurants = restaurants.filter(r => r.approvalStatus === "pending").length;
    console.log("Pending restaurants count:", pendingRestaurants);
    const activeUsers = users.filter(u => u.isActive).length;
    const activeRestaurants = restaurants.filter(r => r.isActive && r.approvalStatus === "approved").length;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const platformCommission = totalRevenue * 0.1; // Assuming 10% commission

    const stats = {
      totalUsers: users.length,
      totalCustomers: users.filter(u => u.role === "customer").length,
      totalRestaurants: restaurants.length,
      approvedRestaurants: restaurants.filter(r => r.approvalStatus === "approved").length,
      totalOrders: orders.length,
      deliveredOrders: orders.filter(o => o.status === "delivered").length,
      totalRevenue: totalRevenue,
      successfulPayments: payments.filter(p => p.status === "success").length,
      failedPayments: payments.filter(p => p.status === "failed").length,
      // Additional stats for dashboard
      newUsersThisMonth,
      newRestaurantsThisMonth,
      completedOrdersThisMonth,
      revenueThisMonth,
      pendingRestaurants,
      issues: 0, // Placeholder for issues
      activeUsers,
      activeRestaurants,
      avgOrderValue: Math.round(avgOrderValue),
      platformCommission: Math.round(platformCommission)
    };

    console.log("Returning stats:", stats);
    res.json({ stats });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

export default router;
