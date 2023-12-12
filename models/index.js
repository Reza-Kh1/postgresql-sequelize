import { dataBase } from "../config/postgreSql.js";
import userModal from "./userModel.js";
import productModel from "./productModel.js";
import categoryModel from "./categoryModel.js";
import subCategoryModel from "./subCategoryModel.js";
import reviewsModel from "./reviewsModel.js";
import shoppingCartModel from "./shoppingCartModel.js";
import paymentCart from "./paymentCartModel.js";
import discountModel from "./discountModel.js";
import orderModel from "./orderModel.js";
import address from "./addressModel.js";
import imgModel from "./imgModel.js";
userModal.hasOne(productModel, {
  foreignKey: "id_user",
  as: "userModal",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
productModel.belongsTo(userModal, {
  foreignKey: "id_user",
  as: "productModel",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
categoryModel.hasMany(subCategoryModel, {
  foreignKey: "category_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
subCategoryModel.belongsTo(categoryModel, {
  foreignKey: "category_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
subCategoryModel.hasOne(productModel, {
  foreignKey: "subCategory_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
productModel.belongsTo(subCategoryModel, {
  foreignKey: "subCategory_id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});
// کامنت ها
productModel.hasOne(reviewsModel, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
reviewsModel.belongsTo(productModel, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
userModal.hasOne(reviewsModel, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});
reviewsModel.belongsTo(userModal, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});
reviewsModel.hasMany(reviewsModel, { foreignKey: "parent_id", as: "replies" });
// کامنت ها
// سبد خرید
userModal.hasOne(shoppingCartModel, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
shoppingCartModel.belongsTo(userModal, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
shoppingCartModel.hasMany(orderModel, {
  foreignKey: "cart_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
discountModel.hasOne(shoppingCartModel, {
  foreignKey: "discount_id",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});
shoppingCartModel.belongsTo(discountModel, {
  foreignKey: "discount_id",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});
orderModel.belongsTo(shoppingCartModel, {
  foreignKey: "cart_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
productModel.hasMany(orderModel, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
orderModel.belongsTo(productModel, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// سبد خرید
userModal.hasMany(address, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  validate: {
    maxTreeAddress(value) {
      if (value > 3) {
        throw new Error("بیش از 3 ادرس برای هر شخص مجاز نمی باشد");
      }
    },
  },
});
address.belongsTo(userModal, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//RESTRICT این یکی میاد قبل از پاک کردن میپرسه و میگه اول زیرمجموعه هارو پاک کن
//NO ACTION هیچ کاری انجام نمیده فقط ارور میده
//SET NULL رکورد اصلی رو که حذف کنیم بقیه زیر رکورد ها جاشون نال میاد
//CASCADE همه رکوردهارو ازبین میبره همراه با رکورد اصلی خیلی ریسکیع
// dataBase.sync({ force: true });
dataBase.sync();
export {
  userModal,
  productModel,
  categoryModel,
  subCategoryModel,
  reviewsModel,
  shoppingCartModel,
  paymentCart,
  discountModel,
  address,
  orderModel,
  imgModel,
};
