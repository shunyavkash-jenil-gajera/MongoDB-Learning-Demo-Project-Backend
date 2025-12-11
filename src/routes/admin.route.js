import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import {
  createSeller,
  getAllSellers,
  getAllUsers,
  updateSellerIsActive,
} from "../controllers/admin/index.admin.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createSellerSchema } from "../validation/seller.validation.js";

const router = express.Router();

router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/sellers", authMiddleware, isAdmin, getAllSellers);
router.put("/sellers/status", authMiddleware, isAdmin, updateSellerIsActive);
router.post(
  "/sellers",
  validate(createSellerSchema),
  authMiddleware,
  isAdmin,
  createSeller
);

export default router;

//today i worked on my demo project ,
// deisgn and impliment product module pages , and after that ,
// i added error handler and logger ,
// and i improve folder structure on the backend
