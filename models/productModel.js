import { DataTypes, ENUM } from "sequelize";
import { dataBase } from "../config/postgreSql.js";
const productModel = dataBase.define(
  "products",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10),
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    color: {
      type: DataTypes.ARRAY(DataTypes.ENUM(["green", "blue", "red", "black"])),
    },
    // برای استفاده از مدل
    // color_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: colorModel,
    //     key: 'id'
    //   }
    // },
  },
  {
    timestamps: true,
    tableName: "products",
  }
);
export default productModel;
