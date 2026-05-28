import express from "express";
import providersController from "../../controller/provider/providerController";

const router = express.Router();
router
  .route("/")
  .get(providersController.getProviders)
  .post(providersController.insertProviders);
router
  .route("/:id")
  .put(providersController.updateProviders)
  .delete(providersController.deleteProviders);
router.route("/many").post(providersController.insertManyProviders);

export default router;
