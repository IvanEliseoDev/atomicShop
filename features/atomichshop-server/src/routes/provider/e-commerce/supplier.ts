import express from "express";
import { providersEcommerceController } from "../../../controller/provider/e-commerce/providersController";

const router = express.Router();

// Ruta publica para obtener proveedores en la home (solo nombre e imagen)
router.route("/home-providers").get(providersEcommerceController.getHomeProviders);

export default router;