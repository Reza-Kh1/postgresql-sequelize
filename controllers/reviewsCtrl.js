import { reviewsModel } from "../models/index.js";
import asyncHandler from "express-async-handler";
import { customError } from "../middlewares/globalErrorHandle.js";
export const createReviews = asyncHandler(async (req, res) => {
  const { userId, ProductId, comment, replay, score } = req.body;
  let commentInfo = {
    user_id: userId,
    comment,
  };
  if (replay) {
    commentInfo.parent_id = replay;
    commentInfo.score = null;
  }
  if (ProductId) {
    (commentInfo.product_id = ProductId),
      (commentInfo.score = score ? score : 5);
  }
  try {
    const data = await reviewsModel.create({ ...commentInfo });
    res.send({ data });
  } catch (err) {
    throw customError("خطایی رخ داد لطفا دوباره تلاش کنید", 400);
  }
});
export const getAllReviews = asyncHandler(async (req, res) => {
  const data = await reviewsModel.findAll({
    where: { status: false },
    order: [["createdAt", "DESC"]],
  });
  if (data.length === 0)
    throw customError("هیچ کامنتی برای نمایش وجود ندارد", 404);
  res.send({ data });
});
export const getSingleReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await reviewsModel.findByPk(id);
  if (!data) throw customError("کامنت مورد نطر یافت نشد", 404);
  res.send({ data });
});
export const updateRevies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment, status, score } = req.body;
  try {
    const data = await reviewsModel.findByPk(id);
    if (!data) throw customError("همچین کامنتی وجود ندارد", 404);
    if (comment) {
      data.comment = comment;
    }
    if (status) {
      data.status = status;
    }
    if (score) {
      data.score = score;
    }
    await data.save();
    res.send({ data });
  } catch (err) {
    throw customError("خطایی در اپدیت کامنت ایجاد شده است", 400);
  }
});
export const deleteReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await reviewsModel.destroy({ where: { id } });
  if (!data)
    throw customError("خطایی در حذف کامنت به وجود اومد دوباره تلاش کنید", 404);
  res.send({ message: "کامنت مورد نظر با موفقیت نصب شد" });
});
