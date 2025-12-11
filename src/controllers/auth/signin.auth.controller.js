import { User } from "../../schemas/admin.schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { generateAccessAndRefreshTokens } from "../../services/token.services.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return sendResponse(res, 400, ERROR_MSG.USER_NOT_FOUND);
  }

  const isPasswordValid = user.password === password;
  if (!isPasswordValid) {
    return sendResponse(res, 400, ERROR_MSG.INVALID_PASSWORD);
  }
  try {
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
      id: user._id,
      email: user.email,
    });
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, { secure: false })
      .cookie("refreshToken", refreshToken, { secure: false })
      .json(
        sendResponse(
          res,
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          SUCCESS_MSG.USER_LOGGED_IN
        )
      );
  } catch (error) {
    console.error("Login Error:", error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
