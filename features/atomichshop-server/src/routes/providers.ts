// ruta: ../src/routes/providers.ts

import express from "express";
import providersController from "../controller/providersController";

// Route() nos ayuda a colocar los metodos
// Que tendra mi enpoint
// para ponerle a los metodos que tendran nuestros enpoints
const router = express.Router();

// Con pleca significa que el enpoit solo va a mandar datos y recibir para funcionar
router
  .route("/")
  .get(providersController.getProviders)
  .post(providersController.insertProviders);

// Con pleca y :id significa que el enpoint va a funcionar por medio de un id para funcionar
router
  .route("/:id")
  .put(providersController.updateProviders)
  .delete(providersController.deleteProviders);

// Para enpoints de insercion masiva
router.route("/many").post(providersController.insertManyProviders);

export default router;
