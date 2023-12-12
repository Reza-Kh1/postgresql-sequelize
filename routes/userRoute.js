import express from "express";
import { creatUser, deleteUser, getAllUser, getUser, loginUser, updateUser } from "../controllers/userCtrl.js";
import isUser from "../utils/isUserToken.js";
import isAdmin from "../utils/isAdminToken.js"
const routes = express.Router();
routes.route("/").get(isAdmin,getAllUser).post(creatUser);
routes.route("/:id").get(getUser).post(loginUser).put(updateUser).delete(deleteUser)
export default routes;