import { dataBase } from "../config/postgreSql.js";
import { DataTypes } from "sequelize";
const addressModel = dataBase.define(
  "address",
  {
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "تهران ",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true, tableName: "address" }
);
export default addressModel;
