import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { Product } from "../../schemas/product.schema.js";
import { sendResponse } from "../../utils/responseUtil.js";

// Publish a product
export const publishProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { published: true },
      { new: true }
    );
    if (!product) return sendResponse(res, 404, ERROR_MSG.PRODUCT_NOT_FOUND);
    return sendResponse(res, 200, product, SUCCESS_MSG.PRODUCT_PUBLISHED);
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};

// Unpublish a product
export const unpublishProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { published: false },
      { new: true }
    );
    if (!product) return sendResponse(res, 404, ERROR_MSG.PRODUCT_NOT_FOUND);

    return sendResponse(res, 200, product, SUCCESS_MSG.PRODUCT_PUBLISHED);
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
