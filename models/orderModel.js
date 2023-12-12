import { dataBase } from "../config/postgreSql.js";
import { DataTypes } from "sequelize";
const orderMOdel = dataBase.define(
  "order",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "order",timestamps:false }
);
export default orderMOdel;