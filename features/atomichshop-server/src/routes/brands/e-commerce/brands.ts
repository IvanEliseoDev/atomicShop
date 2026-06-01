import express from "express";
import { brandsEcommerceController } from "../../../controller/brands/e-commerce/brands";

const router = express.Router();

router.route("/").get(brandsEcommerceController.getBrands);

export default router;
