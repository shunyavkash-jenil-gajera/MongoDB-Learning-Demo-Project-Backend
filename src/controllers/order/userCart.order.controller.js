import { SUCCESS_MSG } from "../../constants/successMessage.js";
import { Order } from "../../schemas/order.schema.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const getUserCart = async (req, res) => {
  console.log("===== getUserCart API called =====", req);

  // const userId = req.user?.id;

  // if (!userId) {
  //   return res.status(400).json(new ApiResponse(400, null, "User ID missing"));
  // }

  // const cartItems = await Order.find({
  //   userId,
  //   status: "addToCart",
  // }).populate("productId");

  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, cartItems, SUCCESS_MSG.CART_FETCHED));
};
