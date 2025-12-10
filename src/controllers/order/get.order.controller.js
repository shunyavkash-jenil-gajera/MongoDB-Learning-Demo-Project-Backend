import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { Order } from "../../schemas/order.schema.js";
import mongoose from "mongoose";

// Get an order by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("productId userId");

  if (!order) throw new ApiError(404, ERROR_MSG.ORDER_NOT_FOUND);

  res.status(200).json(new ApiResponse(200, order, SUCCESS_MSG.ORDER_FETCHED));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { role, id: loggedInUserId } = req.user;

  if (role === "admin") {
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$sellerId",
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          shipped: {
            $sum: {
              $cond: [{ $eq: ["$status", "shipped"] }, 1, 0],
            },
          },
          delivered: {
            $sum: {
              $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
            },
          },
          canceled: {
            $sum: {
              $cond: [{ $eq: ["$status", "canceled"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Admin seller order counts"));
  }

  if (role === "seller") {
    const sellerObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    // PRODUCT-WISE COUNTS
    const productWiseCounts = await Order.aggregate([
      // Join product to access sellerId
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // Match only orders where product.userId === loggedInSellerId
      {
        $match: {
          "product.userId": sellerObjectId,
        },
      },

      // Group by productId
      {
        $group: {
          _id: "$productId",
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          shipped: {
            $sum: {
              $cond: [{ $eq: ["$status", "shipped"] }, 1, 0],
            },
          },
          delivered: {
            $sum: {
              $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
            },
          },
          canceled: {
            $sum: {
              $cond: [{ $eq: ["$status", "canceled"] }, 1, 0],
            },
          },
        },
      },

      // Attach product data
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    // ORDERS LIST ONLY FOR THIS SELLER
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $match: {
          "product.userId": sellerObjectId,
        },
      },

      // populate user and product
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    return res.status(200).json(
      new ApiResponse(200, {
        productWiseCounts,
        orders,
      })
    );
  }

  if (role === "user") {
    const orders = await Order.find({ userId: loggedInUserId }).populate(
      "productId"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, orders, "User orders fetched"));
  }
});
