import { DataTypes } from "sequelize";
import { dataBase } from "../config/postgreSql.js";
const subCategoryModel = dataBase.define(
  "subCategory",
  {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  { timestamps: true, tableName: "subCategory" }
);
export default subCategoryModel;
