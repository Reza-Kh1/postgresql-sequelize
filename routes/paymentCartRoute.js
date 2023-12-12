import express from "express";
import { getAllPayment, paymentCartCtrl } from "../controllers/paymentCartCtrl.js";
const routes = express.Router();
routes.route("/").get(getAllPayment)
routes.route("/:id").get(paymentCartCtrl).delete()
export default routes;
