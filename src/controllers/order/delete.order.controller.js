import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { Order } from "../../schemas/order.schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;

    const order = await Order.findOneAndDelete({
      _id: id,
      userId: userId,
      status: "addToCart",
    });

    if (!order) {
      return sendResponse(res, 404, ERROR_MSG.CART_ITEM_NOT_FOUND);
    }

    return sendResponse(
      res,
      200,
      order,
      SUCCESS_MSG.CART_ITEM_DELETED_SUCCESSFULLY
    );
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message =
      error instanceof ApiError
        ? error.message
        : ERROR_MSG.INTERNAL_SERVER_ERROR;
    return sendResponse(res, statusCode, message);
  }
};

export const clearUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Order.deleteMany({
      userId: userId,
      status: "addToCart",
    });

    return sendResponse(
      res,
      200,
      result,
      SUCCESS_MSG.CART_CLEARED_SUCCESSFULLY
    );
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message =
      error instanceof ApiError
        ? error.message
        : ERROR_MSG.INTERNAL_SERVER_ERROR;
    return sendResponse(res, statusCode, message);
  }
};
