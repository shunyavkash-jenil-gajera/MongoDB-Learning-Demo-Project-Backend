import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { Order } from "../../schemas/order.schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) return sendResponse(res, 400, ERROR_MSG.ORDER_NOT_FOUND);

    return sendResponse(res, 200, order, SUCCESS_MSG.ORDER_UPDATED);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message =
      error instanceof ApiError
        ? error.message
        : ERROR_MSG.INTERNAL_SERVER_ERROR;
    return sendResponse(res, statusCode, message);
  }
};

export const addQuantityToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const orderCheckStatus = await Order.findById(id);
    if (orderCheckStatus.status !== "addToCart") {
      throw new ApiError(400, ERROR_MSG.NOT_ADD_QUANTITY);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $inc: { quantity: quantity } },
      { new: true }
    );
    if (!order) throw new ApiError(404, ERROR_MSG.ORDER_NOT_FOUND);
    res
      .status(200)
      .json(new ApiResponse(200, order, SUCCESS_MSG.ORDER_UPDATED));
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
