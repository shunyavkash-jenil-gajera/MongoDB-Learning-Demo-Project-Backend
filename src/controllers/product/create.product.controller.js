import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { Product } from "../../schemas/product.schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { upload } from "../../utils/multer.js";

export const createProduct = asyncHandler(async (req, res) => {
  upload.single("images")(req, res, async (err) => {
    if (err) throw new ApiError(400, err.message);

    const { name, price, description, category } = req.body;
    const product = new Product({
      name,
      price,
      description,
      category,
      images: req.file.path,
      userId: req.user.id,
    });
    await product.save();
    res
      .status(201)
      .json(new ApiResponse(201, product, SUCCESS_MSG.PRODUCT_CREATED));
  });
});
