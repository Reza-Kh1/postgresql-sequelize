import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategory,
  getSingleSubCategory,
  updateSubCategory,
} from "../controllers/subCategory.js";
const routes = express.Router();

routes.route("/").get(getAllSubCategory).post(createSubCategory);
routes.route("/:id").get(getSingleSubCategory).put(updateSubCategory).delete(deleteSubCategory)
export default routes;
