import { User } from "../../schemas/admin.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";

// Update seller's isActive status
export const updateSellerIsActive = asyncHandler(async (req, res) => {
  const { sellerId, isActive } = req.body;

  if (!sellerId || typeof isActive !== "boolean") {
    throw new ApiError(400, ERROR_MSG.ALL_FIELDS_ARE_REQUIRED);
  }

  const updatedSeller = await User.findByIdAndUpdate(
    sellerId,
    { isActive },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedSeller) {
    throw new ApiError(404, ERROR_MSG.SELLER_NOT_FOUND);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSeller, SUCCESS_MSG.UPDATED_SELLER));
});
