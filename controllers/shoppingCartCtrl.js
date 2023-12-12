import {
  discountModel,
  orderModel,
  productModel,
  shoppingCartModel,
} from "../models/index.js";
import asyncHandler from "express-async-handler";
import { customError } from "../middlewares/globalErrorHandle.js";
import orderMOdel from "../models/orderModel.js";
export const createShoppingCart = asyncHandler(async (req, res) => {
  const { userId, productId, quantity, detail } = req.body;
  try {
    const [findCart, createCart] = await shoppingCartModel.findOrCreate({
      where: { user_id: userId },
      defaults: { user_id: userId },
    });
    const [findOrder, createOrder] = await orderMOdel.findOrCreate({
      where: {
        product_id: productId,
        cart_id: findCart.id,
      },
      defaults: {
        product_id: productId,
        cart_id: findCart.id,
        quantity,
        detail,
      },
    });
    if (!createOrder) {
      findOrder.quantity = quantity;
      findOrder.detail = detail;
      findOrder.save();
    }
    res.send({ findOrder, message: "محصول به سبد خرید اضافه شد" });
  } catch (err) {
    throw customError("خطایی پیش امد لطفا دوباره تلاش کنید", 400);
  }
});
export const getShoppingCart = asyncHandler(async (req, res) => {
  let { page } = req.query;
  if (!page) {
    page = 1;
  }
  const limit = 10;
  const data = await shoppingCartModel.findAll({
    order: [["updatedAt", "DESC"]],
    attributes: { exclude: ["createdAt", "user_id"] },
    include: [{ model: orderMOdel, attributes: { exclude: ["cart_id"] } }],
    limit: limit,
    offset: limit * page - limit,
  });
  const count = await shoppingCartModel.count();
  const nextPage = Number(page) + 1;
  const prevPage = Number(page) - 1;
  const allPage = Math.ceil(count / limit);
  let pagination = {
    allPage,
  };
  if (allPage >= nextPage) {
    pagination.nextPage = nextPage;
  }
  if (prevPage > 0) {
    pagination.prevPage = prevPage;
  }
  res.send({ data, pagination });
});
export const updateShoppingCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, detail } = req.body;
  try {
    const data = await orderModel.findByPk(id);
    if (!data) throw customError("مشکلی به وجو اومد دوباره تلاش کنید", 404);
    if (detail) {
      data.detail = detail;
    }
    if (quantity) {
      data.quantity = quantity;
    }
    if (quantity || detail) {
      console.log("ok");
      data.save();
    }
    res.send({ message: "با موفقیت به روزرسانی شد", data });
  } catch (err) {
    throw customError("خطایی به وجود امده لطفا دوباره تلاش کنید", 400);
  }
});
export const deleteShoppingCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await orderMOdel.destroy({ where: { id } });
  if (!data) throw customError("مشکلی پیش آمده", 400);
  res.send({ message: "با موفقیت حذف شد" });
});
export const singleShoppingCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let price = 0;
  try {
  const data = await shoppingCartModel.findAndCountAll({
    where: { user_id: id },
    attributes: ["discount_id", "id"],
    include: [
      {
        model: orderMOdel,
        include: [{ model: productModel, attributes: ["name", "price"] }],
        attributes: { exclude: ["cart_id"] },
      },
      { model: discountModel, attributes: ["discountAmount"] },
    ],
  });
  if (data.rows[0].orders.length > 0) {
    await data.rows[0].orders.forEach((i) => {
      console.log(i.product.price);
      price += Number(i.dataValues.product.dataValues.price);
    });
    if (data.rows[0].discount_id) {
      const discountCart = await shoppingCartModel.findByPk(data.rows[0].id, {
        attributes: ["id"],
        include: [{ model: discountModel, attributes: ["discountAmount"] }],
      });
      const discount = price * Number(discountCart.discount.discountAmount);
      price = price - discount;
      data.discount = discount;
    }
  }
  data.totalPrice = price;
  res.send({ data });
  } catch (err) {
    throw customError("خطایی به وجود امد لطفا به مدیر سایت گزارش دهید", 400);
  }
});