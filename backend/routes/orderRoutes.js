import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Review from "../models/Review.js";
import FoodItem from "../models/FoodItem.js";
import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// 👤 CUSTOMER - PLACE ORDER
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total and get restaurant ID from first item
    let totalAmount = 0;
    let restaurantId = null;

    for (let item of items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      if (!foodItem) {
        return res.status(404).json({ message: `Food item ${item.foodItem} not found` });
      }
      
      if (!restaurantId) {
        restaurantId = foodItem.restaurant;
      } else if (restaurantId.toString() !== foodItem.restaurant.toString()) {
        return res.status(400).json({ message: "Items from different restaurants cannot be ordered together" });
      }

      totalAmount += foodItem.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: "pending"
    });

    res.status(201).json({ 
      message: "Order placed successfully", 
      order,
      paymentRequired: totalAmount,
      currency: "₹"
    });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});

// 👤 CUSTOMER - PROCESS PAYMENT (SIMULATED)
router.post("/:id/payment", verifyToken, async (req, res) => {
  try {
    const { paymentMethod, simulateFailure } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Simulate payment (90% success rate if not simulating failure)
    const isSuccess = simulateFailure ? false : Math.random() > 0.1;

    const payment = await Payment.create({
      order: order._id,
      user: req.user.id,
      amount: order.totalAmount,
      paymentMethod: paymentMethod || "card",
      transactionId,
      status: isSuccess ? "success" : "failed",
      failureReason: isSuccess ? null : "Payment declined by bank"
    });

    if (isSuccess) {
      // Update order payment status
      await Order.findByIdAndUpdate(req.params.id, { paymentStatus: "completed" });
      
      // Update restaurant earnings
      const restaurant = await Restaurant.findByIdAndUpdate(
        order.restaurant,
        { 
          $inc: { 
            totalEarnings: order.totalAmount,
            totalOrders: 1
          }
        }
      );

      res.json({
        success: true,
        message: "Payment successful",
        transactionId,
        amount: `₹${order.totalAmount}`,
        order
      });
    } else {
      // Update order payment status
      await Order.findByIdAndUpdate(req.params.id, { paymentStatus: "failed" });

      res.status(400).json({
        success: false,
        message: "Payment failed",
        transactionId,
        reason: "Payment declined by bank",
        retryable: true
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error: error.message });
  }
});

// 👤 CUSTOMER - GET MY ORDERS
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("restaurant", "name address")
      .populate("items.foodItem", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// 👤 CUSTOMER - GET ORDER DETAILS
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant", "name address image")
      .populate("items.foodItem", "name price description");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

// 👤 CUSTOMER - CANCEL ORDER
router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Can only cancel pending or accepted orders
    if (!["pending", "accepted"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    // Issue refund if payment was completed
    if (order.paymentStatus === "completed") {
      await Order.findByIdAndUpdate(req.params.id, {
        status: "cancelled",
        paymentStatus: "refunded",
        refundAmount: order.totalAmount,
        refundStatus: "completed"
      });

      res.json({
        message: "Order cancelled and refund initiated",
        refundAmount: `₹${order.totalAmount}`,
        status: "refunded"
      });
    } else {
      await Order.findByIdAndUpdate(req.params.id, {
        status: "cancelled"
      });

      res.json({
        message: "Order cancelled"
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order" });
  }
});

// 👤 CUSTOMER - SUBMIT REVIEW/RATING
router.post("/:id/review", verifyToken, async (req, res) => {
  try {
    const { foodItem, type, rating, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Can only review delivered orders" });
    }

    const review = await Review.create({
      order: order._id,
      customer: req.user.id,
      restaurant: order.restaurant,
      foodItem: foodItem || null,
      type,
      rating,
      comment
    });

    // Update food item or restaurant rating
    if (type === "food" && foodItem) {
      const food = await FoodItem.findById(foodItem);
      food.totalRatings += 1;
      food.rating = ((food.rating * (food.totalRatings - 1)) + rating) / food.totalRatings;
      await food.save();
    } else if (type === "restaurant") {
      const restaurant = await Restaurant.findById(order.restaurant);
      const allReviews = await Review.find({ 
        restaurant: order.restaurant, 
        type: "restaurant" 
      });
      restaurant.rating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await restaurant.save();
    }

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error submitting review", error: error.message });
  }
});

// 👤 CUSTOMER - GET PAYMENT RECEIPT
router.get("/:id/receipt", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant", "name address")
      .populate("items.foodItem", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const payment = await Payment.findOne({ order: order._id });

    const receipt = {
      orderId: order._id,
      date: order.createdAt,
      restaurant: order.restaurant.name,
      items: order.items.map(item => ({
        name: item.foodItem.name,
        quantity: item.quantity,
        price: `₹${item.price}`,
        total: `₹${item.price * item.quantity}`
      })),
      totalAmount: `₹${order.totalAmount}`,
      paymentMethod: order.paymentMethod,
      transactionId: payment?.transactionId,
      status: order.status,
      deliveryAddress: order.deliveryAddress
    };

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: "Error fetching receipt" });
  }
});

export default router;
