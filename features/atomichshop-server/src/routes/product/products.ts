import express from "express";
import { productsController } from "../../controller/product/productsController";

const router = express.Router();

router
  .route("/")
  .get(productsController.getProducts)
  .post(productsController.insertProducts);
router
  .route("/:id")
  .put(productsController.updateProducts)
  .delete(productsController.deleteProducts);

// Para enpoints de insercion masiva
router.route("/many").post(productsController.insertManyProducts);

export default router;
