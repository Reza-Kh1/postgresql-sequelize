import { DataTypes } from "sequelize";
import { dataBase } from "../config/postgreSql.js";
const imgModel = dataBase.define(
  "images",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "images", timestamps: false }
);
export default imgModel