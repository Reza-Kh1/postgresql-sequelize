import { discountModel, shoppingCartModel } from "../models/index.js";
import asyncHandler from "express-async-handler";
import { customError } from "../middlewares/globalErrorHandle.js";
export const useDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { idCart } = req.query;
  const discount = await discountModel.findOne({ where: { name: id } });
  if (!discount) throw customError("کد تخفیف وارد شده اشتباه است", 400);
  if (0 >= discount.amount) {
    throw customError("کد تخفیف منقضی شده است", 400);
  }
  const cart = await shoppingCartModel.findByPk(idCart);
  if (!cart || cart.discount_id) throw customError("خطایی به وجود امد لطفا دوباره تلاش کنید", 400);
  cart.discount_id = discount.id;
  discount.amount -= 1;
  cart.save();
  discount.save()
  res.status(200).send({ message: "تخفیف ثبت شد" });
});
export const createDiscount = asyncHandler(async (req, res) => {
  const { name, endTime, amount, discountAmount } = req.body;
  if ((!name, !endTime, !amount, !discountAmount))
    throw customError("لطفا تمام فیلد هارو پر کنید", 500);
  const data = await discountModel.create({
    name,
    endTime: Date.now(),
    amount,
    discountAmount,
  });
  res.status(200).send({ data });
});
export const getAllDiscount = asyncHandler(async (req, res) => {
  const data = await discountModel.findAll();
  // if (!data.rows?.length) throw customError("هیچ کد نخفیفی ثبت نشده", 400);
  res.send({ data });
});
export const updateDiscount = asyncHandler(async (req, res) => {
  const { name, endTime, amount, discountAmount } = req.body;
  const { id } = req.params;
  const data = await discountModel.findByPk(id);
  if (!data) throw customError("خطایی ایجاد شده لطفا دوباره تلاش کنید", 400);
  try {
    if (name) {
      data.name = name;
    }
    if (endTime) {
      data.endTime = Date.now();
    }
    if (amount) {
      data.amount = amount;
    }
    if (discountAmount) {
      data.discountAmount = discountAmount;
    }
    data.save();
    res.send({ message: "با موفقیت به روز شد", data });
  } catch (err) {
    throw customError("خطایی ایجاد شده لطفا دوباره تلاش کنید", 400);
  }
});
export const deleteDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await discountModel.destroy({ where: { id } });
  if (!data) throw customError("در حذف با خطا روبرو شدیم", 400);
  res.send({ message: "با موفقیت حذف شد" });
});