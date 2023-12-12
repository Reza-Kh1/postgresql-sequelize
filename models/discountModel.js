import { DataTypes } from "sequelize";
import { dataBase } from "../config/postgreSql.js";
const discountModel = dataBase.define(
  "discount",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { tableName: "discount", timestamps: true }
);
export default discountModel;
