import { Order } from "../../schemas/order.schema.js";
import mongoose from "mongoose";
import { sendResponse } from "../../utils/responseUtil.js";
import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";

export const getAllOrders = async (req, res) => {
  try {
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

      return sendResponse(res, 200, result, SUCCESS_MSG.ORDER_FETCHED);
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

      return sendResponse(
        res,
        200,
        { productWiseCounts, orders },
        SUCCESS_MSG.ORDER_FETCHED
      );
    }

    if (role === "user") {
      const orders = await Order.find({ userId: loggedInUserId }).populate(
        "productId"
      );

      return sendResponse(res, 200, orders, SUCCESS_MSG.ORDER_FETCHED);
    }
  } catch (error) {
    console.error("Get All Orders Error:", error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, ERROR_MSG.INVALID_ORDER_ID);
    }

    const order = await Order.findById(id).populate("productId userId");

    if (!order) return sendResponse(res, 404, ERROR_MSG.ORDER_NOT_FOUND);

    return sendResponse(res, 200, order, SUCCESS_MSG.ORDER_FETCHED);
  } catch (error) {
    console.error("Get Order By ID Error:", error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
