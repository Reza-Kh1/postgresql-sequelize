import express from "express";
import { createProduct, deleteProduct, getAllProduct, getSingleProduct, searchProduct, updateProduct } from "../controllers/productCtrl.js";
const routes = express.Router();
routes.route('/search').get(searchProduct)
routes.route("/").get(getAllProduct).post(createProduct);
routes.route("/:id").get(getSingleProduct).put(updateProduct).delete(deleteProduct)
export default routes;
