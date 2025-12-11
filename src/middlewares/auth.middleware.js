import { Access_Token_Secret } from "../config/enverment.js";
import { User } from "../schemas/admin.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, _, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log("Extracted token:", token);
    if (!token) {
      console.error("No token provided in cookies or Authorization header");
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    if (token.split(".").length < 0) {
      throw new ApiError(401, "Unauthorized request: Malformed token");
    }

    const decodedToken = jwt.verify(token, Access_Token_Secret);

    if (!decodedToken?.id) {
      console.error("Decoded token does not contain user ID:", decodedToken);
      throw new ApiError(401, "Unauthorized request: Invalid token payload");
    }

    console.log("Decoded token:", decodedToken);
    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      console.error("User not found for token:", decodedToken);
      throw new ApiError(401, "Unauthorized request: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const isAdmin = (req, res, next) => {
  const user = req.user;

  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

export const isSeller = (req, res, next) => {
  const user = req.user;

  if (user && user.role === "seller") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Sellers only." });
  }
};

export const isUser = (req, res, next) => {
  const user = req.user;

  if (user && user.role === "user") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Users only." });
  }
};
export const isSellerOrAdmin = (req, res, next) => {
  const user = req.user;

  if (user && (user.role === "seller" || user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Sellers or Admins only." });
  }
};
export const isUserOrAdmin = (req, res, next) => {
  const user = req.user;

  if (user && (user.role === "user" || user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Users or Admins only." });
  }
};
