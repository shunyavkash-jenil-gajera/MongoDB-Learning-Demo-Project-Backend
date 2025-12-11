import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { Product } from "../../schemas/product.schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { upload } from "../../utils/multer.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const createProduct = async (req, res) => {
  try {
    upload.array("images", 10)(req, res, async (err) => {
      if (err) throw new ApiError(400, err.message);

      const { name, price, description, category } = req.body;

      if (!req.files || req.files.length === 0) {
        return sendResponse(res, 400, ERROR_MSG.IMAGES_REQUIRES);
      }
      const imageUrls = req.files.map((file) => {
        return `${req.protocol}://${req.get("host")}/${file.path}`;
      });

      const product = new Product({
        name,
        price,
        description,
        category,
        images: imageUrls,
        userId: req.user.id,
      });

      await product.save();

      return sendResponse(res, 200, product, SUCCESS_MSG.PRODUCT_CREATED);
    });
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
