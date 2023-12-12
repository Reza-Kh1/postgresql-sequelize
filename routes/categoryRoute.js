import express from "express";
const routes = express.Router();
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryCtrl.js";
routes.route("/").get(getAllCategory).post(createCategory);
routes.route("/:id").get(getSingleCategory).put(updateCategory).delete(deleteCategory)
export default routes;
