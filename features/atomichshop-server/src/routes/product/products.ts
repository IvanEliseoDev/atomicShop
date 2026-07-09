import express from "express";
import { productsController } from "../../controller/product/productsController";
import upload from "../../utils/cloudinaryConfig";

const router = express.Router();

router
  .route("/")
  .get(productsController.getProducts)
  .post(upload.array("images"), productsController.insertProducts);
router
  .route("/:id")
  .get(productsController.getProductById)
  .put(upload.array("images"), productsController.updateProducts)
  .delete(productsController.deleteProducts);

router.route("/:id/toggle").patch(productsController.toggleProductState);

// Para enpoints de insercion masiva
router.route("/many").post(productsController.insertManyProducts);

export default router;
