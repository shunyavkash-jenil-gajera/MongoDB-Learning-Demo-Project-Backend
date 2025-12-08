import Product from "../../models/product.model.js";
import upload from "../../utils/multer.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";

// Create a product
export const createProduct = asyncHandler(async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) throw new ApiError(400, err.message);

    const { name, price, description } = req.body;
    const product = new Product({
      name,
      price,
      description,
      image: req.file.path,
      seller: req.user.id, // Assuming seller ID is in req.user
    });
    await product.save();
    res
      .status(201)
      .json(new ApiResponse(201, product, SUCCESS_MSG.PRODUCT_CREATED));
  });
});

// Update a product
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const product = await Product.findByIdAndUpdate(id, updates, { new: true });
  if (!product) throw new ApiError(404, ERROR_MSG.PRODUCT_NOT_FOUND);
  res
    .status(200)
    .json(new ApiResponse(200, product, SUCCESS_MSG.PRODUCT_UPDATED));
});

// Delete a product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, ERROR_MSG.PRODUCT_NOT_FOUND);
  res.status(200).json(new ApiResponse(200, null, SUCCESS_MSG.PRODUCT_DELETED));
});

// Get product by ID
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, ERROR_MSG.PRODUCT_NOT_FOUND);
  res
    .status(200)
    .json(new ApiResponse(200, product, SUCCESS_MSG.PRODUCT_FETCHED));
});

// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res
    .status(200)
    .json(new ApiResponse(200, products, SUCCESS_MSG.PRODUCTS_FETCHED));
});

// Publish a product
export const publishProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { published: true },
    { new: true }
  );
  if (!product) throw new ApiError(404, ERROR_MSG.PRODUCT_NOT_FOUND);
  res
    .status(200)
    .json(new ApiResponse(200, Product, SUCCESS_MSG.PRODUCT_PUBLISHED));
});

// Unpublish a product
export const unpublishProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { published: false },
    { new: true }
  );
  if (!product) throw new ApiError(404, ERROR_MSG.PRODUCT_NOT_FOUND);
  res
    .status(200)
    .json(new ApiResponse(200, product, SUCCESS_MSG.PRODUCT_PUBLISHED));
});
