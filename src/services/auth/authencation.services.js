import jwt from "jsonwebtoken";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../schemas/admin.schema.js";
import dotenv from "dotenv";
import { generateAccessAndRefreshTokens } from "../token.services.js";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if ([firstName, lastName, email, password].some((field) => !field)) {
    throw new ApiError(400, ERROR_MSG.ALL_FIELDS_ARE_REQUIRED);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, ERROR_MSG.USER_ALREADY_EXISTS);
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  console.log("Newly created user:", newUser);

  console.log("Access Token Secret:", accessTokenSecret);
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpiry,
    }
  );

  console.log("Generated JWT Token:", token);

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, ERROR_MSG.REGISTRRING_THE_USER_ERROR);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
        token,
      },
      SUCCESS_MSG.USER_REGISTERED
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => !field)) {
    throw new ApiError(400, ERROR_MSG.ALL_FIELDS_ARE_REQUIRED);
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.error("User not found with email:", email);
    throw new ApiError(400, ERROR_MSG.INVALID_CREDENTIALS);
  }

  const isPasswordValid = user.password === password;
  if (!isPasswordValid) {
    console.error("Invalid password for user:", email);
    throw new ApiError(400, ERROR_MSG.INVALID_CREDENTIALS);
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
        new ApiResponse(
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
    throw error;
  }
});

export { registerUser, loginUser };
