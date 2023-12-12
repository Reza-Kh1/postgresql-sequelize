import express from "express";
const routes = express.Router();
import {
  getShoppingCart,
  deleteShoppingCart,
  createShoppingCart,
  updateShoppingCart,
  singleShoppingCart,
} from "../controllers/shoppingCartCtrl.js";
routes.route("/").get(getShoppingCart).post(createShoppingCart);
routes
  .route("/:id")
  .put(updateShoppingCart)
  .delete(deleteShoppingCart)
  .get(singleShoppingCart);
export default routes;
