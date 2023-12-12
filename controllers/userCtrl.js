import { userModal } from "../models/index.js";
import asyncHandler from "express-async-handler";
import { compareHash } from "../utils/craeteHash.js";
import { customError } from "../middlewares/globalErrorHandle.js";
import createToken from "../utils/createToken.js";

export const creatUser = asyncHandler(async (req, res) => {
  const { name, password, phone, email } = req.body;
  if (!phone || !name || !password)
    throw customError("تمام فیلدهارو پر کنید", 400);
  const check = await userModal.findOne({
    where: {
      phone,
    },
  });
  const user = { name, password, phone, email: email ? email : null };
  const isAdmin = await userModal.count();
  if (isAdmin === 0) {
    user.role = "ADMIN";
  }
  if (check) throw new Error("با این شماره تلفن قبلا ثبت نام کردند");
  const data = await userModal.create({ ...user });
  let pas = { ...data.dataValues };
  pas.password = null;
  const tokenInfo = {
    role: pas.role,
    name: pas.name,
    id: pas.id,
    email: pas.email,
    phone: pas.phone,
  };
  res.send({ data: pas, token: await createToken(tokenInfo) });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) throw customError("لطفاتمام فیلد هارو پر کنید", 400);
  let data = await userModal.findOne({
    where: {
      phone,
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  if (!data) {
    throw customError("کسی با این شماره تلفن ثبت نام نکرده است !", 404);
  }
  compareHash(password, data.password);
  let gog = { ...data.dataValues };
  gog.password = null;
  res.send({
    token: await createToken(gog),
    data: gog,
  });
});

export const getAllUser = asyncHandler(async (req, res) => {
  // console.log(req.userInfo);
  let { page } = req.query;
  if (!page) {
    page = 1;
  }
  const data = await userModal.findAndCountAll({
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    limit: 5,
    offset: page * 5 - 5,
  });
  if (!data) throw customError("هیچ اطلاعاتی وجود ندارد برای نمایش ", 404);
  const allPages = Math.ceil(data.count / 5);
  const nextPage = Number(page) + 1;
  let pages = {
    allPage: allPages,
  };
  if (nextPage < allPages) {
    pages.nextPage = nextPage;
  }
  if (Number(page) !== 1) {
    pages.prevPage = Number(page) - 1;
  }
  res.send({
    data,
    pages,
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await userModal.findOne({ where: { id: id } });
  if (!data) {
    throw customError(" کاربر مورد نظر یافت نشد", 404);
  }
  res.send({ data });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;
  const data = await userModal.findByPk(id);
  if (!data)
    throw new Error("عملیات اپدیت با خطا روبرو شده است لطفا دوباره تلاش کنید");
  if (name) {
    data.name = name;
  }
  if (email) {
    data.email = email;
  }
  if (role) {
    data.role = role;
  }
  data.save();
  res.send(data);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await userModal.destroy({ where: { id } });
  if (data === 0)
    throw customError("عملیات حذف با خطا روبرو شد لططفا بعدا دوباره تلاش کنید");
  res.status(200).send({ message: "کاربر با موفقیت حذف شد" });
});
