import { Router } from "express";
import use from "../errorHandler/globle.error.handler.js";

import { authMiddleware, isSeller } from "../middlewares/auth.middleware.js";
import {
  changeOrderStatus,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../controllers/order/index.order.js";

const router = Router();

router.post("/create", authMiddleware, use(createOrder));
router.patch("/update/:id", authMiddleware, use(updateOrder));
router.patch(
  "/update-status/:id",
  authMiddleware,
  isSeller,
  use(changeOrderStatus)
);
router.get("/:id", authMiddleware, use(getOrderById));
router.get("/", authMiddleware, use(getAllOrders));

export default router;
