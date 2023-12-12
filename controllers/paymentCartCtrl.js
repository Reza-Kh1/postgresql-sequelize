import {
  discountModel,
  paymentCart,
  productModel,
  shoppingCartModel,
  userModal,
} from "../models/index.js";
import asyncHandler from "express-async-handler";
import orderMOdel from "../models/orderModel.js";
export const paymentCartCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let price = 0;
  let discount = "";
  const data = await shoppingCartModel.findByPk(id, {
    include: [
      { model: userModal, attributes: ["phone", "name"] },
      { model: discountModel, attributes: ["discountAmount"] },
    ],
  });
  let order = await orderMOdel.findAndCountAll({
    where: { cart_id: id },
    attributes: ["quantity", "detail"],
    include: [{ model: productModel, attributes: ["price", "name"] }],
  });
  await order.rows.forEach((i) => {
    price += Number(i.product.price);
  });
  if (data.discount) {
    discount = data.discount.discountAmount;
    price = price - price * discount;
  }

  const pager = {
    quantity: order.count,
    totalPrice: price,
    details: { phone: data.user.name, name: data.user.phone, pro: order.rows },
    discount: discount,
  };
  const cartPayment = await paymentCart.create(pager);
  res.send({ cartPayment });
});
export const deletePayment = asyncHandler(async (req, res) => {});
export const getSinglePayment = asyncHandler(async (req, res) => {

});
export const getAllPayment = asyncHandler(async (req, res) => {
    const data = await paymentCart.findAndCountAll()
    res.send({data})
});
