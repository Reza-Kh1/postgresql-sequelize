import express from "express";
import {
  createReviews,
  deleteReviews,
  getAllReviews,
  getSingleReviews,
  updateRevies,
} from "../controllers/reviewsCtrl.js";
const routes = express.Router();
routes.route("/").get(getAllReviews).post(createReviews);
routes
  .route("/:id")
  .get(getSingleReviews)
  .put(updateRevies)
  .delete(deleteReviews);
export default routes;
