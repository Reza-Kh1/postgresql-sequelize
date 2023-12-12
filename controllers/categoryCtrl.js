import { categoryModel, subCategoryModel } from "../models/index.js";
import asyncHandler from "express-async-handler";

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await categoryModel.destroy({ where: { id } });
  if (data === 0)
    throw new Error("عملیات حذف با خطا روبرو شد لطفا بعدا دوباره تلاش کنید");
  res.send({ message: "دسته با موفقیت حذف شد" });
});
export const getAllCategory = asyncHandler(async (req, res) => {
  const data = await categoryModel.findAll();
  res.send({ data });
});
export const getSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await categoryModel.findByPk(id,{
    include:{
      model:subCategoryModel,
    }
  });
  res.send({ data });
});
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const data = await categoryModel.findByPk(id);
    if (!data) throw new Error();
    if (name) {
      data.name = name;
    }
    data.save();
    res.send({ data });
  } catch (err) {
    throw new Error("عملیات آپدیت با خطا روبرو شد");
  }
});
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const data = await categoryModel.findOrCreate({
    where: { name },
    defaults: { name },
  });
  if (!data[1]) throw new Error("این نام در دسته ها وجود دارد");
  res.send({ message: "دسته با موفقیت افزوده شد" });
});
