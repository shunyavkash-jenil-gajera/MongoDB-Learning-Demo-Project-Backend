import { User } from "../schemas/admin.schema.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import dotenv from "dotenv";
import { ERROR_MSG } from "../constants/errorMessage.js";
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

const generateAccessAndRefreshTokens = async ({ id, email }) => {
  const accessToken = jwt.sign({ id, email }, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });

  const refreshToken = jwt.sign({ id, email }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });

  return { accessToken, refreshToken };
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, ERROR_MSG.UNAUTHORIZED);
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, ERROR_MSG.INVALID_TOKEN);
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, ERROR_MSG.TOKEN_EXPIRED);
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    console.error("Error refreshing access token:", error.message || error);
    throw new ApiError(500, ERROR_MSG.REFRESHING_ACCESS_TOKEN_ERROR);
  }
});

export { generateAccessAndRefreshTokens, refreshAccessToken };
