import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { User } from "../../schemas/admin.schema.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select(
      "-password -refreshToken"
    );
    return sendResponse(res, 200, sellers, SUCCESS_MSG.FETCHED_SELLERS);
  } catch (error) {
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    return sendResponse(res, 200, users, SUCCESS_MSG.FETCHED_USERS);
  } catch (error) {
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
});
