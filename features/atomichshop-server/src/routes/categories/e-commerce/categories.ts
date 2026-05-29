import express from "express";
import { categoriesEcommerceController } from "../../../controller/categories/e-commerce/categories";

const router = express.Router();

router.route("/").get(categoriesEcommerceController.getCategories);

export default router;
