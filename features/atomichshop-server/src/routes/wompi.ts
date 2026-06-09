import express from "express";
import { wompiController } from "../controller/wompiController";

const router = express.Router();

router.route("/token").post(wompiController.generarToken);
router.route("/pay").post(wompiController.realizarPago);

export default router;