import {
  categoryModel,
  productModel,
  subCategoryModel,
} from "../models/index.js";
import asyncHandler from "express-async-handler";
import { customError } from "../middlewares/globalErrorHandle.js";
import { Op } from "sequelize";

export const createSubCategory = asyncHandler(async (req, res) => {
  const { name, categorId } = req.body;
  try {
    const check = await subCategoryModel.findOrBuild({
      where: { [Op.and]: [{ name: name }, { category_id: categorId }] },
    });
    // const data = await subCategoryModel.findOrCreate({
    //   where: { [Op.and]: [{ name }, { category_id: categorId }] },
    //   defaults: {
    //     name,
    //     category_id: categorId,
    //   },
    // });
    if (!check[1]) throw new Error();
    const data = await subCategoryModel.create({
      name,
      category_id: categorId,
    });
    res.send({ message: "زیردسته با موفقیت افزوده شد", data });
  } catch (err) {
    throw customError("این زیردسته ازقبل برای این دسته وجود دارد");
  }
});
export const getAllSubCategory = asyncHandler(async (req, res) => {
  const data = await subCategoryModel.findAll();
  res.send({ data });
});
export const getSingleSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await subCategoryModel.findByPk(id, {
    include: {
      model: categoryModel,
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
    },
  });
  if (!data) throw customError("این دسته بندی یافت نشد", 404);
  const countProduct = await productModel.findAndCountAll({
    where: { subCategory_id: id },
    attributes: {
      exclude: [
        "description",
        "createdAt",
        "updatedAt",
        "id_user",
        "subCategory_id",
      ],
    },
  });
  res.send({ data, countProduct });
});
export const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const data = await subCategoryModel.findByPk(id);
    if (!data) throw new Error();
    if (name) {
      data.name = name;
    }
    data.save();
    res.send({ data });
  } catch (err) {
    throw customError(
      "عملیات آپدیت با خطا روبرو شد بعدا دوباره تلاش کنید",
      404
    );
  }
});
export const deleteSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await subCategoryModel.destroy({ where: { id } });
  if (data === 0) throw customError("عملیات حذف با خطا روبرو شد", 400);
  res.send({ message: "زیر دسته با موفقیت حذف شد" });
});
