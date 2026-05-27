import express from "express";
import { productsEcommerceController } from "../../controller/product/productsEcommerceController";

const router = express.Router();

// Ruta para el carrusel de la pagina de inicio
router.route("/home-carousel").get(productsEcommerceController.getHomeCarousel);

// Ruta para busqueda dinamica (usa query params: ?q=nombre)
router.route("/search").get(productsEcommerceController.searchProducts);

// Ruta para la tienda con filtros (usa query params: ?minPrice=X&brandId=Y...)
router.route("/shop").get(productsEcommerceController.getProductsShop);

// Ruta para productos similares (se recomienda pasar categoryId y currentId por query)
router.route("/similar").get(productsEcommerceController.getSimilarProducts);

// Ruta para el detalle de un producto por ID
router.route("/:id").get(productsEcommerceController.getProductById);

export default router;