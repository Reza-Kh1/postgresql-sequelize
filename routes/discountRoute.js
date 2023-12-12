import express from "express";
import {
  createDiscount,
  deleteDiscount,
  getAllDiscount,
  updateDiscount,
  useDiscount,
} from "../controllers/discountCtrl.js";
const routes = express.Router();
routes.route("/").get(getAllDiscount).post(createDiscount);
routes
  .route("/:id")
  .get(useDiscount)
  .put(updateDiscount)
  .delete(deleteDiscount);
export default routes;
