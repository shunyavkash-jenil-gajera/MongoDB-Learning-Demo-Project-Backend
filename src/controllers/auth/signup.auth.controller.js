import { User } from "../../schemas/admin.schema.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import jwt from "jsonwebtoken";
import { sendResponse } from "../../utils/responseUtil.js";
import {
  Access_Token_Expiry,
  Access_Token_Secret,
} from "../../config/enverment.js";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, ERROR_MSG.USER_ALREADY_EXISTS);
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      Access_Token_Secret,
      { expiresIn: Access_Token_Expiry }
    );

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return sendResponse(res, 400, ERROR_MSG.REGISTRRING_THE_USER_ERROR);
    }

    return sendResponse(
      res,
      200,
      {
        user: createdUser,
        token,
      },
      SUCCESS_MSG.USER_REGISTERED
    );
  } catch (error) {
    console.error("Signup Error:", error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
