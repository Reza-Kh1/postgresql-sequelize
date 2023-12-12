import { DataTypes, ENUM } from "sequelize";
import { dataBase } from "../config/postgreSql.js";
import { createHash } from "../utils/craeteHash.js";
const userModal = dataBase.define(
  "users",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: 4,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["ADMIN", "USER", "AUTHOR"],
      defaultValue: "USER",
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set: async function (value) {
        this.setDataValue("password", await createHash(value));
      },
      // get(pass) {
      //   return `${this.password} and new password ${pass}`;
      // },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    // phone: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    //   is: {
    //     args: /^\+?\d{10,14}$/,
    //     msg: "لطفا شماره تلفن خور را وارد کنید",
    //   },
    // },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^(?:[0-9] ?){9,10}[0-9]$/,
          msg: "لطفا شماره تلفن خود را وارد کنید",
        },
      },
    },
  },
  {
    indexes: [
      { unique: false, fields: ["name"] },
      { unique: true, fields: ["phone"] },
    ],
    tableName: "users",
    timestamps: true,
  }
);

export default userModal;
