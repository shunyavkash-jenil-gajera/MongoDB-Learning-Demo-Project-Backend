import { Router } from "express";

import { authMiddleware, isSeller } from "../middlewares/auth.middleware.js";
import {
  addQuantityToOrder,
  changeOrderStatus,
  clearUserCart,
  createOrder,
  deleteCartItem,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../controllers/order/index.order.js";
import { getUserCart } from "../controllers/order/userCart.order.controller.js";

const router = Router();

router.post("/create", authMiddleware, createOrder);
router.get("/all-orders", authMiddleware, getAllOrders);
router.patch("/update/:id", authMiddleware, addQuantityToOrder);
router.patch("/update-status/:id", authMiddleware, isSeller, changeOrderStatus);

// router.get("/user-cart", getUserCart);

router.get("/order/:id", authMiddleware, getOrderById);

//cart route
// router.delete("/remove-item/:id", authMiddleware, deleteCartItem);
// router.delete("/clear-cart", authMiddleware, clearUserCart);

export default router;
