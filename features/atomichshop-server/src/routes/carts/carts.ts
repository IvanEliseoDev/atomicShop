import express from "express";
import { cartEcommerceController } from "../../controller/carts/carts";

const router = express.Router();

// Ruta para obtener el carrito completo por clientId (sidebar y pagina carrito)
router.route("/:clientId").get(cartEcommerceController.getCartByClient);

// Ruta para agregar o actualizar producto en el carrito
router.route("/").post(cartEcommerceController.addOrUpdateCart);

// Ruta para eliminar un producto especifico del carrito
router.route("/remove").delete(cartEcommerceController.removeProductFromCart);

export default router;