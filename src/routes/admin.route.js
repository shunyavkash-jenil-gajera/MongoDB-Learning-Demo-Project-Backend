import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllSellers,
  getAllUsers,
} from "../controllers/admin/admin.controller.js";
import { updateSellerIsActive } from "../controllers/admin/updateSellerIsActive.controller.js";
import { createSeller } from "../controllers/admin/createSeller.controller.js";

const router = express.Router();

router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/sellers", authMiddleware, isAdmin, getAllSellers);
router.put("/sellers/status", authMiddleware, isAdmin, updateSellerIsActive);
router.post("/sellers", authMiddleware, isAdmin, createSeller);

export default router;
