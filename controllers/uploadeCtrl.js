import asyncHandler from "express-async-handler";
import imgModel from "../models/imgModel.js";
import { customError } from "../middlewares/globalErrorHandle.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const createImage = asyncHandler(async (req, res) => {
  if (req.file == undefined) {
    res.send({ message: "هیچ عکسی انتخاب نشده است " });
    return;
  }
  try {
    await imgModel.create({ name: req.file.path.replace(/\\/g, "/") });
    res.send({ message: "عکس با موفقیت ذخیره شد" });
  } catch (err) {
    throw customError("خطایی ایجاد شد لطفا دوباره تلاش کنید", 400);
  }
});
export const createImages = asyncHandler(async (req, res) => {
  if (req.files == undefined) {
    res.send({ message: "هیچ عکسی انتخاب نشده است " });
    return;
  }
  const imgArray = req.files.map((i) => {
    return { name: i.path.replace(/\\/g, "/") };
  });
  try {
    await imgModel.bulkCreate(imgArray);
    res.send({ message: "عکس با موفقیت ذخیره شد" });
  } catch (err) {
    throw customError("خطایی ایجاد شد لطفا دوباره تلاش کنید", 400);
  }
});
export const getAllImg = asyncHandler(async (req, res) => {
  let { page } = req.query;
  if (!page) {
    page = 1;
  }
  const limit = 10;
  const data = await imgModel.findAndCountAll({
    limit,
    offset: page * limit - limit,
  });
  const allPage = Math.ceil(data.count / limit);
  const prevPage = page - 1;
  const nextPage = Number(page) + 1;
  const pagination = {
    allPage,
  };
  if (nextPage <= allPage) {
    pagination.nextPage = nextPage;
  }
  if (prevPage > 0) {
    pagination.prevpage = prevPage;
  }
  data.pagination = pagination;
  res.send({ data });
});
export const deleteImg = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const img = await imgModel.findByPk(id);
  const nameImg = img.name.replace("public/img/", "");
  const urlUpload = path.join(__dirname, `../public/img/${nameImg}`);
  try {
    fs.unlink(urlUpload, async (err) => {
      if (err) {
        res.send({ messag: "خطایی در حذف تصویر رخ داده است" });
        return;
      }
    });
    await img.destroy();
    res.send({ message: "عکس با موفقیت حذف شد" });
  } catch (err) {
    throw new customError("خطایی به وجود امد و عکس ها پاک نشدند", 400);
  }
});
export const getFileImg = asyncHandler(async (req, res) => {
  const urlUpload = path.join(__dirname, "../public/img");
  fs.readdir(urlUpload, (err, files) => {
    if (err) {
      return res.status(500).send("خطایی رخ داده است");
    }
    const lenght = files.length;
    res.send({ files, lenght });
    return;
  });
});
