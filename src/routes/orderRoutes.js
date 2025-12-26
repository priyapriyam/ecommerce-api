import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderById,
  cancelOrder,
  returnOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Create Order
router.post("/create", protect, createOrder);

// Get all orders of logged-in user
router.get("/my-orders", protect, getMyOrders);

//by ids
router.get("/:id", getOrderById);

//update status
router.put("/orders/:id/status", updateOrderById);

//cancel order
router.put("/orders/:id/cancel", cancelOrder);

//return order
router.put("/orders/:id/return", returnOrder);

export default router;
