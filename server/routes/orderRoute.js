import express from "express";
import {
  createOrder,
  getOrdersByStatus,
  getOrdersByUser,
  getOrderStatusCounts,
  updateOrderStatus,
} from "../controllers/orderController.js";
const router = express.Router();

router.post("/create", createOrder);
router.get("/count", getOrderStatusCounts);
router.get("/get-order-by-status/:status", getOrdersByStatus);
router.put("/update-status/:orderId", updateOrderStatus);
router.get("/get-order-by-user/:userId", getOrdersByUser);

export default router;
