import { User } from "../../schemas/admin.schema.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const updateSellerIsActive = async (req, res) => {
  try {
    const { sellerId, isActive } = req.body;

    if (!sellerId || typeof isActive !== "boolean") {
      return sendResponse(res, 400, ERROR_MSG.INVALID_REQUEST_DATA);
    }

    const updatedSeller = await User.findByIdAndUpdate(
      sellerId,
      { isActive },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedSeller) {
      return sendResponse(res, 404, ERROR_MSG.SELLER_NOT_FOUND);
    }

    return sendResponse(
      res,
      200,
      updatedSeller,
      SUCCESS_MSG.SELLER_STATUS_UPDATED
    );
  } catch (error) {
    console.error("Update Seller isActive Error:", error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
