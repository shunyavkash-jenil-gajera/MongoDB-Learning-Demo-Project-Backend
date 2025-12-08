import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { User } from "../../schemas/admin.schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createSeller = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if ([firstName, lastName, email, password].some((field) => !field)) {
    throw new ApiError(400, ERROR_MSG.ALL_FIELDS_ARE_REQUIRED);
  }

  const existingSeller = await User.findOne({ email });
  if (existingSeller) {
    throw new ApiError(400, ERROR_MSG.USER_ALREADY_EXISTS);
  }

  const newSeller = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: "seller",
  });

  const createdSeller = await User.findById(newSeller._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdSeller, SUCCESS_MSG.SELLER_CREATED));
});
