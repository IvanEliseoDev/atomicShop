import express from "express";
import { bannerController } from "../../../controller/banner/e-commerce/bannerController";

const router = express.Router();

// Ruta para el carrusel de baneres de la pagina de inicio
router.route("/banner-carousel").get(bannerController.getHomeBanners);

export default router;