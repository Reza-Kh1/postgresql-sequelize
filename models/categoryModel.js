import { DataTypes } from "sequelize";
import { dataBase } from "../config/postgreSql.js";
const categoryModel = dataBase.define(
  "category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: true, tableName: "category" }
);
export default categoryModel;
