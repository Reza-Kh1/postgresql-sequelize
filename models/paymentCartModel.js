import { DataTypes } from "sequelize";
import { dataBase } from "../config/postgreSql.js";

const paymentCart = dataBase.define(
  "paymentCart",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
    },
    details: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    discount: {
      type: DataTypes.FLOAT,
    },
    userInfo:{
      type:DataTypes.JSONB,
      allowNull:false
    },
  },
  { timestamps: true, tableName: "paymentCart" }
);
export default paymentCart;
