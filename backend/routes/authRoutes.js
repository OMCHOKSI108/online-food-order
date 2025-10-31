import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
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

export default router;
