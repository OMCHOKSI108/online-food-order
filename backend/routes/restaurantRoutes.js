import express from "express";
import Restaurant from "../models/Restaurant.js";
import FoodItem from "../models/FoodItem.js";

const router = express.Router();

// Get all restaurants
router.get("/", async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});

// Get menu for a restaurant
router.get("/:id/menu", async (req, res) => {
  const items = await FoodItem.find({ restaurant: req.params.id });
  res.json(items);
});

export default router;
