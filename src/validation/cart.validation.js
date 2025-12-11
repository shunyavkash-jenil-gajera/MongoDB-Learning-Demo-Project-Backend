import Joi from "joi";

export const cartAddItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().min(1).required(),
});
export const cartUpdateItemSchema = Joi.object({
  quantity: Joi.number().min(1).required(),
});
export const cartRemoveItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});
export const createOrderSchema = Joi.object({
  cartItemIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required(),
});
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "shipped", "delivered", "canceled")
    .required(),
});
