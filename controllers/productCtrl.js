import { Op } from "sequelize";
import { customError } from "../middlewares/globalErrorHandle.js";
import {
  categoryModel,
  productModel,
  reviewsModel,
  subCategoryModel,
  userModal,
} from "../models/index.js";
import asyncHandler from "express-async-handler";

export const getAllProduct = asyncHandler(async (req, res) => {
  let { page } = req.query;
  if (page === 0) throw customError("ادرس اشتباه وارد شده است", 404);
  if (!page) {
    page = 1;
  }
  const data = await productModel.findAndCountAll({
    attributes: { exclude: ["createdAt", "updatedAt", "id_user"] },
    limit: 5,
    offset: 5 * page - 5,
  });
  if (!data.rows.length)
    throw customError("هیچ محصولی براش نمایش وجود ندارد", 404);
  const allPages = Math.ceil(data.count / 5);
  const nextPage = Number(page) + 1;
  const prevPage = Number(page) - 1;
  let pages = {
    allPages,
  };
  if (allPages >= nextPage) {
    pages.nextPage = nextPage;
  }
  if (prevPage > 0) {
    pages.prevPage = prevPage;
  }
  res.send({ data, pages });
});
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    price,
    description,
    quantity,
    idUser,
    categoryId,
    color,
  } = req.body;
  const checkSlug = await productModel.findOne({ where: { slug } });
  if (checkSlug !== null) throw customError("این سلاگ تکراری است !", 404);
  const checkCategory = await subCategoryModel.findByPk(categoryId);
  if (!checkCategory) throw customError("این دسته بندی وجود ندارد !", 404);
  const check = await userModal.findByPk(idUser);
  if (!check) throw customError("ایدی کاربری شما تایید نشد !", 404);
  try {
    const data = await productModel.create({
      name,
      slug,
      price,
      description,
      quantity,
      color: color ? color : null,
      id_user: idUser,
      subCategory_id: categoryId,
    });
    res.send({ data });
  } catch (err) {
    throw customError(
      "در ساخت محصول خطایی ایجاد شد لطفا دوباره تلاش کنید",
      400
    );
  }
});
export const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let data = await productModel.findByPk(id, {
    include: [{ model: subCategoryModel, include: [{ model: categoryModel }] }],
  });
  const reviews = await reviewsModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    where: { product_id: id },
    attributes: {
      exclude: ["id", "status", "updatedAt", "user_id"],
    },
    include: [
      {
        attributes: {
          exclude: ["id", "status", "updatedAt", "user_id"],
        },
        model: reviewsModel,
        as: "replies",
        include: [
          {
            attributes: {
              exclude: ["id", "status", "updatedAt", "user_id"],
            },
            model: reviewsModel,
            as: "replies",
          },
        ],
      },
    ],
    limit: 20,
  });
  if (!data)
    throw customError("محصولی یافت نشد لطفا ادرس خود را درست وارد کنید", 404);
  res.send({ data, reviews });
});
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, description, slug, quantity } = req.body;
  try {
    const data = await productModel.findByPk(id);
    if (!data) throw new Error();
    if (name) {
      data.name = name;
    }
    if (price) {
      data.price = price;
    }
    if (description) {
      data.description = description;
    }
    if (slug) {
      data.slug = slug;
    }
    if (quantity) {
      data.quantity = quantity;
    }
    data.save();
    res.send({ message: "محصول با موفقیت اپدیت شد", data });
  } catch (err) {
    throw customError("محصولی برای آپدیت یافت نشد !", 400);
  }
});
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await productModel.destroy({ where: { id } });
  if (data === 0) throw new Error("عملیات حذف با خطا روبرو شد");
  res.send({ message: "محصول با موفقیت حذف شد" });
});
export const searchProduct = asyncHandler(async (req, res) => {
  let { page, text, price, color, categoryId, order } = req.query;
  const limit = 3;
  let search = {};
  let orderBy = {};
  let pagination = {};
  if (!page) {
    page = 1;
  }
  if (categoryId) {
    search = {
      ...search,
      subCategory_id: categoryId,
    };
  }
  if (text) {
    const searchText = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${text}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${text}%`,
          },
        },
      ],
    };
    search = { ...search, ...searchText };
  }
  if (price) {
    const mony = price.split("-");
    const searchPrice = {
      price: {
        [Op.between]: [mony[0], mony[1]],
      },
    };
    search = {
      ...search,
      ...searchPrice,
    };
  }
  if (color) {
    const bg = color.split("-");
    if (bg.length > 1) {
      const whileColor = bg.map((i) => {
        return {
          [Op.or]: {
            [Op.contains]: [i],
          },
        };
      });

      search = {
        ...search,
        color: {
          [Op.or]: [...whileColor],
        },
      };
    } else {
      search = {
        ...search,
        color: { [Op.contains]: [bg] },
      };
    }
  }
  if (order) {
    const orderLen = order.split(",");
    if (orderLen.length > 1) {
      const op = orderLen.map((i) => {
        return i.split("-");
      });
      orderBy = op;
    } else {
      const jo = orderLen[0].split("-");
      orderBy = [jo];
    }
  }
  try {
    const data = await productModel.findAndCountAll({
      where: {
        ...search,
      },
      limit,
      offset: limit * page - limit,
      order: order ? orderBy : null,
    });
    if (data.rows.length === 0)
      throw customError("هیچ محصولی با فیلتر مورد نظر یافت نشد", 404);
    pagination.allPages = Math.ceil(data.count / limit);
    const nextPage = Number(page) + 1;
    const prevPage = Number(page) - 1;
    if (nextPage < pagination.allPages) {
      pagination.nextPage = nextPage;
    }
    if (prevPage > 0) {
      pagination.prevPage = prevPage;
    }
    data.pagination = pagination;
    res.send({ data });
  } catch (err) {
    throw customError("درخواست شما مجاز نمیباشد");
  }
});
