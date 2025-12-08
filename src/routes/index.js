import { Router } from "express";
import authRoute from "./auth.route.js";
import userRoute from "./admin.route.js";

const router = Router();

router.use("/", authRoute);
router.use("/admin", userRoute);

export default router;
