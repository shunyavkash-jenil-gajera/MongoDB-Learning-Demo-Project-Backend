import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  publishProduct,
  unpublishProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product/index.product.js";
import { authMiddleware, isSeller } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { productCreateSchema } from "../validation/product.validation.js";

const router = Router();

router.post(
  "/create",
  validate(productCreateSchema),
  authMiddleware,
  isSeller,
  createProduct
);
router.get("/all-products", authMiddleware, getAllProducts);
router.put("/update/:id", authMiddleware, updateProduct);
router.get("/product/:id", authMiddleware, getProductById);
router.delete("/delete/:id", authMiddleware, deleteProduct);
router.post("/publish/:id", authMiddleware, publishProduct);
router.post("/unpublish/:id", authMiddleware, unpublishProduct);

export default router;
