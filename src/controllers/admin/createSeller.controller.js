import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { User } from "../../schemas/admin.schema.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const createSeller = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNumber } = req.body;

    const existingSeller = await User.findOne({ email });
    if (existingSeller) {
      return sendResponse(res, 400, ERROR_MSG.USER_ALREADY_EXISTS);
    }

    const newSeller = await User.create({
      firstName,
      lastName,
      email,
      password,
      mobileNumber,
      role: "seller",
    });

    const createdSeller = await User.findById(newSeller._id).select(
      "-password -refreshToken"
    );

    return sendResponse(
      res,
      200,
      createdSeller,
      SUCCESS_MSG.SELLER_CREATED_SUCCESSFULLY
    );
  } catch (error) {
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
