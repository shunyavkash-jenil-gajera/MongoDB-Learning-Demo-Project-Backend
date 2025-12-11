import { Product } from "../../schemas/product.schema.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) return sendResponse(res, 404, ERROR_MSG.PRODUCT_NOT_FOUND);

    return sendResponse(res, 200, SUCCESS_MSG.PRODUCT_DELETED);
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
