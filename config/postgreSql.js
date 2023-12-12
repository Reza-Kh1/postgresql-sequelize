import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
export const dataBase = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASS,
  {
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    dialectOptions: {
      requestTimeout: 30000,
      encrypt: true,
    },
    logging: false,
  }
);
export const connectDb = () => {
  try {
    dataBase.authenticate();
    console.log(`connect ${process.env.DATABASE_DIALECT}`);
  } catch (err) {
    console.log(err);
  }
};
