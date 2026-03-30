import express from "express"
import productsController from "../controller/productsController.js"

// Route() nos ayuda a colocar los metodos
// Que tendra mi enpoint
// para ponerle a los metodos que tendran nuestros enpoints
const router = express.Router()

// Con pleca significa que el enpoit solo va a mandar datos y recibir para funcionar
router.route("/").get(productsController.getProducts).post(productsController.insetProducts);

// Con pleca y :id significa que el enpoint va a funcionar por medio de un id para funcionar
router.route("/:id").put(productsController.updateProducts).delete(productsController.deleteProducts);

// Para enpoints de insercion masiva
router.route("/many").post(productsController.insertManyProducts)

export default router;