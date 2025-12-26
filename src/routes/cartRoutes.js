import express from "express";
import { protect } from "../middlewares//authMiddleware.js";
import {
  createCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

// Add a product to cart
router.post("/add", protect, createCart);

// Get current user's cart
router.get("/my-cart", protect, getCart);

// Update quantity of a product in cart
router.put("/update", protect, updateCartItem);

// Remove a specific product from cart
router.delete("/remove/:productId", protect, removeCartItem);

// Clear entire cart
router.delete("/clear", protect, clearCart);

export default router;

