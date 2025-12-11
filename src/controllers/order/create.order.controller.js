import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { Order } from "../../schemas/order.schema.js";
import { sendResponse } from "../../utils/responseUtil.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const order = new Order({
      productId,
      userId,
      quantity,
    });

    await order.save();
    return sendResponse(
      res,
      200,
      order,
      SUCCESS_MSG.ORDER_CREATED_SUCCESSFULLY
    );
  } catch (error) {
    console.error("Create Order Error:", error.message || error);
    return sendResponse(res, 500, "Internal Server Error");
  }
};
