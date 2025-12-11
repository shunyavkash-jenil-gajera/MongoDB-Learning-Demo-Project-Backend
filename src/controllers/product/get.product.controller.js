import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { Product } from "../../schemas/product.schema.js";
import { sendResponse } from "../../utils/responseUtil.js";

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return sendResponse(res, 404, ERROR_MSG.PRODUCT_NOT_FOUND);

    return sendResponse(res, 200, product, SUCCESS_MSG.PRODUCTS_FETCHED);
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let products;

    if (role === "admin") {
      products = await Product.find();
    } else if (role === "seller") {
      products = await Product.find({ userId });
    } else {
      products = await Product.find({ isPublished: true });
    }

    return sendResponse(res, 200, products, SUCCESS_MSG.PRODUCTS_FETCHED);
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
