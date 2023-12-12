import express from "express";
import { createImage, createImages,deleteImg, getAllImg, getFileImg } from "../controllers/uploadeCtrl.js";
import { uploadImage, uploadImages } from "../middlewares/upload.js";
const routes = express.Router();
routes.route("/").post(uploadImage, createImage).get(getAllImg)
routes.route("/:id").delete(deleteImg).post(uploadImages, createImages).get(getFileImg)
export default routes;
