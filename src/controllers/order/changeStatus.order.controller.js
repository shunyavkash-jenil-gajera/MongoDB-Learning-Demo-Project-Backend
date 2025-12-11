import { ERROR_MSG } from "../../constants/errorMessage.js";
import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { Order } from "../../schemas/order.schema.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const changeOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "shipped", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      sendResponse(res, 400, ERROR_MSG.INVALID_ORDER_STATUS);
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) return sendResponse(res, 404, ERROR_MSG.ORDER_NOT_FOUND);

    return sendResponse(res, 200, order, SUCCESS_MSG.ORDER_STATUS_UPDATED);
  } catch (error) {
    console.error("Change Order Status Error:", error.message || error);
    return sendResponse(res, 500, ERROR_MSG.INTERNAL_SERVER_ERROR);
  }
};
