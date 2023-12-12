import { dataBase } from "../config/postgreSql.js";
import { DataTypes } from "sequelize";
const reviewsModel = dataBase.define(
  "reviews",
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      validate: {
        max: 5,
        min: 1,
      },
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { tableName: "reviews", timestamps: true }
);
export default reviewsModel;
