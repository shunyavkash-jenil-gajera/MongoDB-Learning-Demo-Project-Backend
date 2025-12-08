import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { User } from "../../schemas/admin.schema.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await User.find({ role: "seller" }).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, sellers, SUCCESS_MSG.FETCHED_SELLERS));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, users, SUCCESS_MSG.FETCHED_USERS));
});
