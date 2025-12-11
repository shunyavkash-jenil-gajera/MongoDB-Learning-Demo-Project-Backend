import { Router } from "express";
import authRoute from "./auth.route.js";
import userRoute from "./admin.route.js";
import productRoute from "./product.route.js";
import orderRoute from "./order.route.js";

const router = Router();

router.use("/", authRoute);
router.use("/admin", userRoute);
router.use("/products", productRoute);
router.use("/orders", orderRoute);

export default router;
