import { dataBase } from "../config/postgreSql.js";
import { DataTypes } from "sequelize";
const shoppingCartModel = dataBase.define(
  "shoppingCart",
  {},
  { tableName: "shoppingCart", timestamps: true }
);
export default shoppingCartModel;
